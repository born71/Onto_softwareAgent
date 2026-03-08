from rdflib import Graph, Namespace, Literal
from collections import defaultdict

# โหลด Ontology
g = Graph()
print("Loading ontology...")
g.parse("backend/neo4j/import/JobMatching100.ttl", format="turtle")
print(f"Loaded {len(g)} triples from the ontology.")

JM = Namespace("http://www.example.org/job-matching-ontology#")

def build_skill_map():
    """สร้าง Mapping ของชื่อ Skill (lowercase) -> (URI, Label จริง) เพื่อการค้นหาแบบ Case-insensitive"""
    skill_map = {}
    query = """
    PREFIX jm: <http://www.example.org/job-matching-ontology#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?skillUri ?label
    WHERE {
        ?skillUri a jm:Skill ;
                  rdfs:label ?label .
    }
    """
    for row in g.query(query):
        label = str(row.label)
        skill_map[label.lower()] = (str(row.skillUri), label)
    return skill_map

def get_job_data():
    """ดึงข้อมูล Job และ requirements ทั้งหมดเตรียมไว้"""
    job_data = defaultdict(lambda: {"skills": set(), "groups": set(), "label": "", "detail": ""})
    
    query_jobs = """
    PREFIX jm: <http://www.example.org/job-matching-ontology#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?job ?jobLabel ?reqSkill ?reqGroup ?detail
    WHERE {
        ?job a jm:Job .
        ?job rdfs:label ?jobLabel .
        OPTIONAL { ?job jm:hasDetail ?detail . }
        OPTIONAL { ?job jm:requiresSkill ?reqSkill . }
        OPTIONAL { ?job jm:requiresSkillGroup ?reqGroup . }
    }
    """
    for row in g.query(query_jobs):
        job_uri = str(row.job)
        job_data[job_uri]["label"] = str(row.jobLabel)
        
        if row.detail:
            job_data[job_uri]["detail"] = str(row.detail)
        
        if row.reqSkill:
            job_data[job_uri]["skills"].add(str(row.reqSkill))
        if row.reqGroup:
            job_data[job_uri]["groups"].add(str(row.reqGroup))
            
    return job_data

def get_skill_info(skill_uri):
    """ดึงข้อมูล Base Language และ Group ของ Skill URI"""
    # ใช้ Literal หรือ URIRef ให้ถูกต้อง แต่ที่นี่เรารับ skill_uri เป็น string URI
    query = f"""
    PREFIX jm: <http://www.example.org/job-matching-ontology#>
    SELECT ?basedOn ?group
    WHERE {{
        OPTIONAL {{ <{skill_uri}> jm:isBasedOnLanguage ?basedOn . }}
        OPTIONAL {{ <{skill_uri}> jm:hasSkillGroup ?group . }}
    }}
    """
    
    res = g.query(query)
    for row in res:
        return (str(row.basedOn) if row.basedOn else None, 
                str(row.group) if row.group else None)
    return None, None

def test_job_matching(user_skills):
    # เตรียมข้อมูล
    skill_map = build_skill_map()
    job_data_store = get_job_data()
    job_scores = defaultdict(float)
    matched_reasons = defaultdict(list) # เก็บเหตุผลว่า match เพราะอะไร

    print(f"\nUser Skills: {user_skills}")
    
    found_any_skill_in_ontology = False

    # วนลูปเช็ค Skill ของผู้ใช้ทีละตัว
    for skill_name in user_skills:
        skill_key = skill_name.lower().strip()
        
        if skill_key not in skill_map:
            print(f"[!] ไม่พบ Skill '{skill_name}' ใน Ontology (ข้ามไป)")
            continue
            
        found_any_skill_in_ontology = True
        skill_uri, real_label = skill_map[skill_key]
        based_on_uri, group_uri = get_skill_info(skill_uri)
        
        # print(f"[*] Analyzing Skill: {real_label}")

        # คำนวณคะแนนกับทุก Job
        for job_uri, data in job_data_store.items():
            score_increment = 0.0
            reasons = []

            # Match ตรงๆ (Weight 1.0)
            if skill_uri in data["skills"]:
                score_increment = 1.0
                reasons.append(f"Direct Match: {real_label}")
            
            # Match ผ่าน Base Language (Weight 0.6)
            # เช่น Job ต้องการ JS เรามี React (React -> basedOn JS)
            # เราจะได้คะแนน 0.6 เพราะเรารู้ Framework ของภาษานั้น
            elif based_on_uri and based_on_uri in data["skills"]:
                score_increment = 0.6
                base_name = based_on_uri.split('_')[-1] # ดึงชื่อจาก URI คร่าวๆ
                reasons.append(f"Base Lang Match: Job needs Base of {real_label}")
                
            # Match ผ่าน Group (Weight 0.2)
            # เช่น Job ต้องการ Frontend เรามี React (React -> Group Frontend)
            elif group_uri and group_uri in data["groups"]:
                score_increment = 0.2
                group_name = group_uri.split('_')[-1]
                reasons.append(f"Group Match: Job needs Group of {real_label}")
            
            if score_increment > 0:
                job_scores[job_uri] += score_increment
                matched_reasons[job_uri].extend(reasons)

    if not found_any_skill_in_ontology:
        print("\n[Warning] ไม่พบ skill ของคุณในระบบเลย ไม่สามารถแนะนำงานได้")
        return

    # เรียงลำดับคะแนน
    sorted_jobs = sorted(job_scores.items(), key=lambda item: item[1], reverse=True)
    
    if not sorted_jobs:
        print("\nไม่พบงานที่เหมาะสมกับทักษะของคุณ")
        return

    print("\n" + "="*60)
    print(f"Top 5 Matched Jobs (Total matches: {len(sorted_jobs)})")
    print("="*60)

    for i, (job_uri, score) in enumerate(sorted_jobs[:5], 1):
        job_info = job_data_store[job_uri]
        print(f"{i}. {job_info['label']}")
        print(f"   Score: {score:.1f}")
        
        desc = job_info.get('detail', 'No details available')
        # ตัดข้อความให้สั้นลงถ้ามันยาวเกินไป
        short_desc = (desc[:100] + '...') if len(desc) > 100 else desc
        print(f"   Detail: {short_desc.replace(chr(13), ' ')}")
        
        # แสดง Unique reasons
        unique_reasons = set(matched_reasons[job_uri])
        print(f"   Matches: {', '.join(unique_reasons)}")
        print("-" * 60)

if __name__ == "__main__":
    # ลองเปลี่ยน Skill เพื่อทดสอบ
    my_skills = ["Python", "Kubernetes", "docker"]
    
    test_job_matching(my_skills)
