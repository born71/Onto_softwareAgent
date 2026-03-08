import { getSession } from '../config/database.js';
import { UserProfile } from '../types/index.js';
import { TextProcessor } from '../utils/text-processor.js';

export class Neo4jService {

    /**
   * Get all jobs from the database (Ontology adaptation)
   */
    async getAllJobs() {
        const session = getSession();
        try {
            const result = await session.run(`
        MATCH (j:ns0__Job)
        OPTIONAL MATCH (j)-[:ns0__postedBy]->(c)
        OPTIONAL MATCH (j)-[:ns0__hasJobType]->(t)
        OPTIONAL MATCH (j)-[:ns0__requiresSkill]->(s)
        WITH j, c, t, collect(replace(s.uri, "http://www.example.org/job-matching-ontology#Skill_", "")) as skills
        RETURN replace(j.uri, "http://www.example.org/job-matching-ontology#Job_", "") as id,
               "Job " + replace(j.uri, "http://www.example.org/job-matching-ontology#Job_", "") as title,
               CASE WHEN c.ns0__hasCompanyName IS NOT NULL THEN c.ns0__hasCompanyName ELSE replace(c.uri, "http://www.example.org/job-matching-ontology#Company_", "") END as company,
               c.ns0__hasCompanyDetail as companyDetail,
               c.ns0__hasAddress as companyAddress,
               CASE WHEN j.ns0__hasLocation IS NOT NULL THEN j.ns0__hasLocation ELSE 'Remote' END as location,
               CASE WHEN j.ns0__hasSalary IS NOT NULL THEN j.ns0__hasSalary ELSE 'Negotiable' END as salaryRange,
               j.ns0__hasDetail as jobDetail,
               j.ns0__hasJobProperties as jobProperties,
               replace(t.uri, "http://www.example.org/job-matching-ontology#JobType_", "") as workStyle,
               skills
        ORDER BY id
      `);

            return result.records.map(record => ({
                id: record.get('id'),
                title: record.get('title'),
                company: record.get('company'),
                companyDetail: record.get('companyDetail') || undefined,
                companyAddress: record.get('companyAddress') || undefined,
                location: record.get('location'),
                salaryRange: record.get('salaryRange'),
                jobDetail: record.get('jobDetail') || undefined,
                jobProperties: record.get('jobProperties') || undefined,
                industry: 'Tech', // Fallback
                workStyle: [record.get('workStyle')],
                description: 'Decentralized Ontology Job', // Fallback
                requiredSkills: record.get('skills'),
                matchScore: 0,
                matchReasons: [],
                experienceMatch: false,
                benefits: []
            }));
        } catch (error) {
            console.error('Error fetching all jobs:', error);
            throw error;
        } finally {
            await session.close();
        }
    }

    /**
     * Find recommendations based on user profile using Graph algorithms (Ontology adaptation)
     */
    async findRecommendations(profile: UserProfile) {
        const session = getSession();
        try {
            const normalizedRole = TextProcessor.normalizeJobTitle(profile.currentRole);
            const roleKeywords = TextProcessor.extractKeywords(profile.currentRole);

            const query = `
        WITH $userSkills as rawUserSkills, $roleKeywords as roleKeywords
        WITH rawUserSkills, roleKeywords, [s IN rawUserSkills | toLower(s)] as userSkills, [k IN roleKeywords | toLower(k)] as lowerRoleKeywords

        MATCH (j:ns0__Job)

        // 1. Collect Job Requirements
        OPTIONAL MATCH (j)-[:ns0__requiresSkill]->(reqSkill)
        OPTIONAL MATCH (j)-[:ns0__requiresSkillGroup]->(reqGroup)

        WITH j, rawUserSkills, roleKeywords,
             collect(DISTINCT toLower(replace(reqSkill.uri, "http://www.example.org/job-matching-ontology#Skill_", ""))) as reqSkills,
             collect(DISTINCT toLower(replace(reqGroup.uri, "http://www.example.org/job-matching-ontology#SkillGroup_", ""))) as reqGroups,
             collect(DISTINCT replace(reqSkill.uri, "http://www.example.org/job-matching-ontology#Skill_", "")) as rawReqSkills

        // 2. Iterate through each User Skill
        UNWIND rawUserSkills as rawUserSkill
        WITH j, reqSkills, reqGroups, rawReqSkills, roleKeywords, toLower(replace(replace(rawUserSkill, " ", "_"), ".", "_")) as userSkillStr

        // 3. Lookup Ontology Maps for the User Skill
        OPTIONAL MATCH (us:ns0__Skill) WHERE toLower(replace(us.uri, "http://www.example.org/job-matching-ontology#Skill_", "")) = userSkillStr
        OPTIONAL MATCH (us)-[:ns0__isBasedOnLanguage]->(bl)
        OPTIONAL MATCH (us)-[:ns0__hasSkillGroup]->(sg)

        WITH j, reqSkills, reqGroups, rawReqSkills, roleKeywords, userSkillStr,
             toLower(replace(bl.uri, "http://www.example.org/job-matching-ontology#Skill_", "")) as blId,
             toLower(replace(sg.uri, "http://www.example.org/job-matching-ontology#SkillGroup_", "")) as sgId

        // 4. Calculate If/Elif Priority Score
        WITH j, reqSkills, reqGroups, rawReqSkills, roleKeywords, userSkillStr, blId, sgId,
             CASE
               WHEN userSkillStr IN reqSkills THEN 1.0
               WHEN blId IS NOT NULL AND blId IN reqSkills THEN 0.6
               WHEN sgId IS NOT NULL AND sgId IN reqGroups THEN 0.2
               ELSE 0.0
             END as skillScoreIncrement,
             CASE WHEN userSkillStr IN reqSkills THEN 1 ELSE 0 END as directMatch,
             CASE WHEN blId IS NOT NULL AND blId IN reqSkills AND NOT userSkillStr IN reqSkills THEN 1 ELSE 0 END as langMatch,
             CASE WHEN sgId IS NOT NULL AND sgId IN reqGroups AND NOT userSkillStr IN reqSkills AND NOT (blId IS NOT NULL AND blId IN reqSkills) THEN 1 ELSE 0 END as groupMatch

        // 5. Aggregate back to Job level
        WITH j, roleKeywords, rawReqSkills, 
             sum(skillScoreIncrement) as totalSkillScore,
             sum(directMatch) > 0 as hasDirectMatch,
             sum(langMatch) > 0 as hasLangMatch,
             sum(groupMatch) > 0 as hasGroupMatch

        WITH j, roleKeywords, rawReqSkills, totalSkillScore, hasDirectMatch, hasLangMatch, hasGroupMatch,
             totalSkillScore as skillScore

        // 6. Gather additional metadata
        OPTIONAL MATCH (j)-[:ns0__postedBy]->(c)
        OPTIONAL MATCH (j)-[:ns0__hasJobType]->(t)

        WITH j, c, t, roleKeywords, rawReqSkills, skillScore, totalSkillScore, hasDirectMatch, hasLangMatch, hasGroupMatch,
             replace(j.uri, "http://www.example.org/job-matching-ontology#Job_", "") as baseId,
             CASE WHEN c.ns0__hasCompanyName IS NOT NULL THEN c.ns0__hasCompanyName ELSE replace(c.uri, "http://www.example.org/job-matching-ontology#Company_", "") END as companyName,
             c.ns0__hasCompanyDetail as companyDetail,
             c.ns0__hasAddress as companyAddress,
             CASE WHEN j.ns0__hasLocation IS NOT NULL THEN j.ns0__hasLocation ELSE 'Unknown' END as jobLocation,
             CASE WHEN j.ns0__hasSalary IS NOT NULL THEN j.ns0__hasSalary ELSE 'Unknown' END as jobSalary,
             j.ns0__hasDetail as jobDetail,
             j.ns0__hasJobProperties as jobProperties,
             replace(t.uri, "http://www.example.org/job-matching-ontology#JobType_", "") as jobType
             
        WITH j, roleKeywords, rawReqSkills, totalSkillScore, skillScore, hasDirectMatch, hasLangMatch, hasGroupMatch, baseId, companyName, companyDetail, companyAddress, jobLocation, jobSalary, jobDetail, jobProperties, jobType,
             "Job " + baseId as title
             
        WITH j, rawReqSkills, totalSkillScore, skillScore, hasDirectMatch, hasLangMatch, hasGroupMatch, baseId, companyName, companyDetail, companyAddress, jobLocation, jobSalary, jobDetail, jobProperties, jobType, title,
             [word IN roleKeywords WHERE toLower(title) CONTAINS word] as titleMatches
             
        WITH rawReqSkills, totalSkillScore, skillScore, hasDirectMatch, hasLangMatch, hasGroupMatch, baseId, companyName, companyDetail, companyAddress, jobLocation, jobSalary, jobDetail, jobProperties, jobType, title,
             size(titleMatches) > 0 as hasTitleMatch

        // Combine Final Score (Pure point accumulation)
        WITH rawReqSkills, totalSkillScore, skillScore, hasDirectMatch, hasLangMatch, hasGroupMatch, baseId, companyName, companyDetail, companyAddress, jobLocation, jobSalary, jobDetail, jobProperties, jobType, title, hasTitleMatch,
             skillScore + (CASE WHEN hasTitleMatch THEN 0.5 ELSE 0.0 END) as matchScore

        WHERE matchScore > 0.0

        
        RETURN baseId as id, title as title, companyName as company, companyDetail, companyAddress,
               jobLocation as location, jobSalary as salaryRange, jobDetail, jobProperties,
               "IT" as industry, CASE WHEN jobType IS NULL THEN "FullTime" ELSE jobType END as workStyle,
               "Matched via semantic requirements" as description,
               matchScore as matchScore,
               rawReqSkills as requiredSkills,
               totalSkillScore as rawSkillScorePoints,
               skillScore as skillSemanticScore,
               100 as industrySemanticScore,
               100 as experienceScore,
               hasTitleMatch,
               hasDirectMatch,
               hasGroupMatch,
               hasLangMatch
        ORDER BY matchScore DESC
        LIMIT 10
      `;

            const result = await session.run(query, {
                userSkills: profile.skills.map(skill => skill.replace(/[\s.]+/g, '_')),
                roleKeywords: roleKeywords
            });

            return result.records.map(record => ({
                id: record.get('id'),
                title: record.get('title'),
                company: record.get('company'),
                companyDetail: record.get('companyDetail') || undefined,
                companyAddress: record.get('companyAddress') || undefined,
                location: record.get('location'),
                salaryRange: record.get('salaryRange'),
                jobDetail: record.get('jobDetail') || undefined,
                jobProperties: record.get('jobProperties') || undefined,
                industry: record.get('industry'),
                workStyle: [record.get('workStyle')],
                description: record.get('description'),
                matchScore: record.get('matchScore'),
                requiredSkills: record.get('requiredSkills'),
                rawSkillScorePoints: record.get('rawSkillScorePoints'),
                skillSemanticScore: record.get('skillSemanticScore'),
                industrySemanticScore: record.get('industrySemanticScore'),
                matchReasons: this.generateReasons(
                    record.get('skillSemanticScore'),
                    record.get('industrySemanticScore'),
                    record.get('experienceScore'),
                    record.get('hasTitleMatch'),
                    record.get('hasDirectMatch'),
                    record.get('hasGroupMatch'),
                    record.get('hasLangMatch')
                ),
                experienceMatch: record.get('experienceScore') >= 70,
                ontologyReasons: ['Matched via Neo4j Graph Analysis (RDF)']
            }));

        } catch (error) {
            console.error('Error finding recommendations:', error);
            throw error;
        } finally {
            await session.close();
        }
    }

    private generateReasons(
        skillScore: number,
        industryScore: number,
        expScore: number,
        hasTitleMatch: boolean,
        hasDirectMatch?: boolean,
        hasGroupMatch?: boolean,
        hasLangMatch?: boolean
    ): string[] {
        const reasons = [];
        if (skillScore > 1.5) reasons.push('Strong skill match');
        if (industryScore > 80) reasons.push('Industry alignment');
        if (expScore > 90) reasons.push('Experience requirement met');
        if (hasTitleMatch) reasons.push('Job title matches your current role');

        if (hasDirectMatch) reasons.push('Exact skill set alignment');
        if (hasGroupMatch) reasons.push('Related skills in general technical domain');
        if (hasLangMatch) reasons.push('Related framework knowledge maps to requirements');

        return reasons;
    }
}
