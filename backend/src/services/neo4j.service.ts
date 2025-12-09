import { getSession } from '../config/database.js';
import { mockJobs } from '../data/jobs.js';
import { skillOntology, industryOntology, companyOntology, ontologyRules } from '../ontology/career-ontology.js';
import { UserProfile } from '../types/index.js';
import { TextProcessor } from '../utils/text-processor.js';

export class Neo4jService {

    /**
     * Seed the database with initial data
     */
    async seedDatabase() {
        const session = getSession();
        try {
            console.log('🌱 Starting database seed...');

            // Clear existing data
            await session.run('MATCH (n) DETACH DELETE n');
            console.log('  Deleted existing data');

            // 1. Create Skills and Categories
            console.log('  Creating skill ontology...');
            for (const [category, skills] of Object.entries(skillOntology)) {
                // Create Category node
                await session.run(
                    `MERGE (c:Category {name: $name})`,
                    { name: category }
                );

                for (const [skillName, skillData] of Object.entries(skills)) {
                    // Create Skill node
                    await session.run(
                        `MERGE (s:Skill {name: $name, level: $level})
             WITH s
             MATCH (c:Category {name: $category})
             MERGE (s)-[:BELONGS_TO]->(c)`,
                        { name: skillName, level: (skillData as any).level, category }
                    );

                    // Create sub-skill relationships
                    if ((skillData as any).subSkills) {
                        for (const subSkill of (skillData as any).subSkills) {
                            await session.run(
                                `MERGE (sub:Skill {name: $subName})
                 WITH sub
                 MATCH (parent:Skill {name: $parentName})
                 MERGE (parent)-[:HAS_SUB_SKILL]->(sub)`,
                                { subName: subSkill, parentName: skillName }
                            );
                        }
                    }

                    // Create related skill relationships
                    if ((skillData as any).relatedSkills) {
                        for (const related of (skillData as any).relatedSkills) {
                            await session.run(
                                `MERGE (r:Skill {name: $relatedName})
                 WITH r
                 MATCH (s:Skill {name: $skillName})
                 MERGE (s)-[:RELATED_TO]->(r)`,
                                { relatedName: related, skillName: skillName }
                            );
                        }
                    }
                }
            }

            // 2. Create Industries
            console.log('  Creating industry ontology...');
            for (const [industryName, data] of Object.entries(industryOntology)) {
                await session.run(
                    `MERGE (i:Industry {name: $name})`,
                    { name: industryName }
                );

                // Link sub-industries
                if ((data as any).subIndustries) {
                    for (const sub of (data as any).subIndustries) {
                        await session.run(
                            `MERGE (s:Industry {name: $subName})
               WITH s
               MATCH (p:Industry {name: $parentName})
               MERGE (p)-[:HAS_SUB_INDUSTRY]->(s)`,
                            { subName: sub, parentName: industryName }
                        );
                    }
                }
            }

            // 3. Create Companies and Jobs
            console.log('  Creating companies and jobs...');
            for (const job of mockJobs) {
                // Create Company
                await session.run(
                    `MERGE (c:Company {name: $name})
           SET c.size = $size, c.location = $location`,
                    { name: job.company, size: job.companySize, location: job.location }
                );

                // Create Job
                const result = await session.run(
                    `CREATE (j:Job {
             id: $id,
             title: $title,
             description: $description,
             salaryRange: $salaryRange,
             requiredExperience: $requiredExperience,
             workStyle: $workStyle
           })
           WITH j
           MATCH (c:Company {name: $company})
           MERGE (c)-[:POSTED]->(j)
           RETURN j`,
                    {
                        id: job.id,
                        title: job.title,
                        description: job.description,
                        salaryRange: job.salaryRange,
                        requiredExperience: job.requiredExperience,
                        workStyle: job.workStyle, // Array is supported by Neo4j driver
                        company: job.company
                    }
                );

                // Link Job to Industry
                await session.run(
                    `MATCH (j:Job {id: $jobId})
           MERGE (i:Industry {name: $industry})
           MERGE (j)-[:IN_INDUSTRY]->(i)`,
                    { jobId: job.id, industry: job.industry }
                );

                // Link Job to Required Skills
                for (const skill of job.requiredSkills) {
                    await session.run(
                        `MATCH (j:Job {id: $jobId})
             MERGE (s:Skill {name: $skill})
             MERGE (j)-[:REQUIRES_SKILL]->(s)`,
                        { jobId: job.id, skill: skill }
                    );
                }
            }

            console.log('✅ Database seeded successfully');
        } catch (error) {
            console.error('Error seeding database:', error);
            throw error;
        } finally {
            await session.close();
        }
    }

    /**
   * Get all jobs from the database
   */
    async getAllJobs() {
        const session = getSession();
        try {
            const result = await session.run(`
        MATCH (j:Job)<-[:POSTED]-(c:Company)
        OPTIONAL MATCH (j)-[:IN_INDUSTRY]->(i:Industry)
        OPTIONAL MATCH (j)-[:REQUIRES_SKILL]->(s:Skill)
        WITH j, c, i, collect(s.name) as skills
        RETURN j.id as id, j.title as title, c.name as company, 
               j.location as location, j.salaryRange as salaryRange,
               i.name as industry, j.workStyle as workStyle,
               j.description as description, skills
        ORDER BY c.name, j.title
      `);

            return result.records.map(record => ({
                id: record.get('id'),
                title: record.get('title'),
                company: record.get('company'),
                location: record.get('location'),
                salaryRange: record.get('salaryRange'),
                industry: record.get('industry'),
                workStyle: record.get('workStyle'),
                description: record.get('description'),
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
     * Find recommendations based on user profile using Graph algorithms
     */
    async findRecommendations(profile: UserProfile) {
        const session = getSession();
        try {
            // Complex Cypher query to find matching jobs
            // 1. Direct skill matches
            // 2. Indirect skill matches (sub-skills, related skills)
            // 3. Industry matches
            // 4. Experience check

            // Normalize user role
            const normalizedRole = TextProcessor.normalizeJobTitle(profile.currentRole);
            const roleKeywords = TextProcessor.extractKeywords(profile.currentRole);

            const query = `
        WITH $userSkills as rawUserSkills, $userIndustry as userIndustry, $userExp as userExp, $roleKeywords as roleKeywords
        
        // Normalize user skills to lowercase
        WITH [s IN rawUserSkills | toLower(s)] as userSkills, userIndustry, userExp, [k IN roleKeywords | toLower(k)] as roleKeywords

        // Find jobs
        MATCH (j:Job)-[:POSTED]-(c:Company)
        MATCH (j)-[:IN_INDUSTRY]->(i:Industry)
        
        // Calculate Skill Score
        OPTIONAL MATCH (j)-[:REQUIRES_SKILL]->(reqSkill:Skill)
        WITH j, c, i, userSkills, userIndustry, userExp, roleKeywords, collect(reqSkill.name) as requiredSkills
        
        // Calculate overlap (Case Insensitive)
        WITH j, c, i, requiredSkills, userSkills, userIndustry, userExp, roleKeywords,
             [skill in requiredSkills WHERE toLower(skill) IN userSkills] as directMatches
        
        // Calculate score components
        WITH j, c, i, requiredSkills, directMatches, userSkills, userIndustry, userExp, roleKeywords,
             size(directMatches) as directMatchCount,
             size(requiredSkills) as totalRequired
             
        // Basic Skill Score (Direct)
        WITH j, c, i, requiredSkills, directMatches, userSkills, userIndustry, userExp, roleKeywords,
             CASE WHEN totalRequired > 0 THEN toFloat(directMatchCount) / totalRequired ELSE 0 END as skillScore

        // Industry Match
        WITH j, c, i, requiredSkills, skillScore, userExp, roleKeywords,
             CASE 
               WHEN toLower(i.name) = toLower(userIndustry) THEN 1.0
               WHEN (i)-[:HAS_SUB_INDUSTRY*]->(:Industry {name: userIndustry}) THEN 0.8
               WHEN (:Industry {name: userIndustry})-[:HAS_SUB_INDUSTRY*]->(i) THEN 0.8
               ELSE 0.0
             END as industryScore
             
        // Experience Match
        WITH j, c, i, requiredSkills, skillScore, industryScore, roleKeywords,
             CASE 
               WHEN userExp >= j.requiredExperience THEN 1.0
               WHEN userExp >= j.requiredExperience * 0.7 THEN 0.5
               ELSE 0.0
             END as expScore

        // Role Match (New Component)
        // Check if job title contains any of the user's role keywords
        WITH j, c, i, requiredSkills, skillScore, industryScore, expScore,
             [word IN roleKeywords WHERE toLower(j.title) CONTAINS word] as titleMatches
        
        WITH j, c, i, requiredSkills, skillScore, industryScore, expScore,
             size(titleMatches) > 0 as hasTitleMatch,
             size(titleMatches) as titleMatchCount

        // Final Weighted Score
        // Added role match bonus (0.2)
        WITH j, c, i, requiredSkills, skillScore, industryScore, expScore, hasTitleMatch,
             (skillScore * 0.4) + (industryScore * 0.2) + (expScore * 0.2) + (CASE WHEN hasTitleMatch THEN 0.2 ELSE 0.0 END) as matchScore
        
        WHERE matchScore > 0.1 // Lower threshold to be more inclusive
        
        RETURN j.id as id, j.title as title, c.name as company, 
               j.location as location, j.salaryRange as salaryRange,
               i.name as industry, j.workStyle as workStyle,
               j.description as description,
               matchScore * 100 as matchScore,
               requiredSkills,
               skillScore * 100 as skillSemanticScore,
               industryScore * 100 as industrySemanticScore,
               expScore * 100 as experienceScore,
               hasTitleMatch
        ORDER BY matchScore DESC
        LIMIT 10
      `;

            const result = await session.run(query, {
                userSkills: profile.skills,
                userIndustry: profile.preferredIndustry,
                userExp: profile.yearsOfExperience,
                roleKeywords: roleKeywords
            });

            return result.records.map(record => ({
                id: record.get('id'),
                title: record.get('title'),
                company: record.get('company'),
                location: record.get('location'),
                salaryRange: record.get('salaryRange'),
                industry: record.get('industry'),
                workStyle: record.get('workStyle'),
                description: record.get('description'),
                matchScore: record.get('matchScore'),
                requiredSkills: record.get('requiredSkills'),
                skillSemanticScore: record.get('skillSemanticScore'),
                industrySemanticScore: record.get('industrySemanticScore'),
                // Add missing fields to match interface
                matchReasons: this.generateReasons(
                    record.get('skillSemanticScore'),
                    record.get('industrySemanticScore'),
                    record.get('experienceScore'),
                    record.get('hasTitleMatch')
                ),
                experienceMatch: record.get('experienceScore') >= 70,
                ontologyReasons: ['Matched via Neo4j Graph Analysis']
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
