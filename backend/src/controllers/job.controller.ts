import { Request, Response } from 'express';
import { Neo4jService } from '../services/neo4j.service.js';

export class JobController {
    private neo4jService: Neo4jService;

    constructor() {
        this.neo4jService = new Neo4jService();
    }

    getAllJobs = async (req: Request, res: Response) => {
        try {
            const jobs = await this.neo4jService.getAllJobs();
            res.json(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            res.status(500).json({ error: 'Failed to fetch jobs' });
        }
    };
}
