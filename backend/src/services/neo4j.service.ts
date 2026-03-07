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
               replace(c.uri, "http://www.example.org/job-matching-ontology#Company_", "") as company,
               replace(t.uri, "http://www.example.org/job-matching-ontology#JobType_", "") as workStyle,
               skills
        ORDER BY id
      `);

            return result.records.map(record => ({
                id: record.get('id'),
                title: record.get('title'),
                company: record.get('company'),
                location: 'Remote', // Fallback
                salaryRange: 'Negotiable', // Fallback
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
        WITH [s IN rawUserSkills | toLower(s)] as userSkills, [k IN roleKeywords | toLower(k)] as roleKeywords

        MATCH (j:ns0__Job)
        OPTIONAL MATCH (j)-[:ns0__postedBy]->(c)
        OPTIONAL MATCH (j)-[:ns0__hasJobType]->(t)
        OPTIONAL MATCH (j)-[:ns0__requiresSkill]->(reqSkill)

        WITH j, c, t, userSkills, roleKeywords, collect(replace(reqSkill.uri, "http://www.example.org/job-matching-ontology#Skill_", "")) as requiredSkills

        WITH j, c, t, requiredSkills, userSkills, roleKeywords,
             [skill in requiredSkills WHERE toLower(skill) IN userSkills] as directMatches

        WITH j, c, t, requiredSkills, directMatches, userSkills, roleKeywords,
             size(directMatches) as directMatchCount,
             size(requiredSkills) as totalRequired
             
        WITH j, c, t, requiredSkills, directMatches, userSkills, roleKeywords,
             CASE WHEN totalRequired > 0 THEN toFloat(directMatchCount) / totalRequired ELSE 0 END as skillScore

        WITH j, c, t, requiredSkills, skillScore, roleKeywords,
             replace(j.uri, "http://www.example.org/job-matching-ontology#Job_", "") as baseId
             
        WITH j, c, t, requiredSkills, skillScore, roleKeywords, baseId,
             "Job " + baseId as title
             
        WITH j, c, t, requiredSkills, skillScore, roleKeywords, baseId, title,
             [word IN roleKeywords WHERE toLower(title) CONTAINS word] as titleMatches
             
        WITH j, c, t, requiredSkills, skillScore, roleKeywords, baseId, title,
             size(titleMatches) > 0 as hasTitleMatch

        WITH j, c, t, requiredSkills, skillScore, baseId, title, hasTitleMatch,
             (skillScore * 0.8) + (CASE WHEN hasTitleMatch THEN 0.2 ELSE 0.0 END) as matchScore

        WHERE matchScore > 0.0
        
        RETURN baseId as id, title as title, replace(c.uri, "http://www.example.org/job-matching-ontology#Company_", "") as company, 
               "Unknown" as location, "Unknown" as salaryRange,
               "IT" as industry, replace(t.uri, "http://www.example.org/job-matching-ontology#JobType_", "") as workStyle,
               "Matched via semantic requirements" as description,
               matchScore * 100 as matchScore,
               requiredSkills,
               skillScore * 100 as skillSemanticScore,
               100 as industrySemanticScore,
               100 as experienceScore,
               hasTitleMatch
        ORDER BY matchScore DESC
        LIMIT 10
      `;

            const result = await session.run(query, {
                userSkills: profile.skills,
                roleKeywords: roleKeywords
            });

            return result.records.map(record => ({
                id: record.get('id'),
                title: record.get('title'),
                company: record.get('company'),
                location: record.get('location'),
                salaryRange: record.get('salaryRange'),
                industry: record.get('industry'),
                workStyle: [record.get('workStyle')],
                description: record.get('description'),
                matchScore: record.get('matchScore'),
                requiredSkills: record.get('requiredSkills'),
                skillSemanticScore: record.get('skillSemanticScore'),
                industrySemanticScore: record.get('industrySemanticScore'),
                matchReasons: this.generateReasons(
                    record.get('skillSemanticScore'),
                    record.get('industrySemanticScore'),
                    record.get('experienceScore'),
                    record.get('hasTitleMatch')
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

    private generateReasons(skillScore: number, industryScore: number, expScore: number, hasTitleMatch: boolean): string[] {
        const reasons = [];
        if (skillScore > 70) reasons.push('Strong skill match');
        if (industryScore > 80) reasons.push('Industry alignment');
        if (expScore > 90) reasons.push('Experience requirement met');
        if (hasTitleMatch) reasons.push('Job title matches your current role');
        return reasons;
    }
}
