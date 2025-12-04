import neo4j, { Driver, Session } from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

let driver: Driver;

export const initDriver = async () => {
    try {
        driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
        const serverInfo = await driver.getServerInfo();
        console.log('Connection established');
        console.log(serverInfo);
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err}`);
    }
};

export const getDriver = (): Driver => {
    return driver;
};

export const closeDriver = async () => {
    if (driver) {
        await driver.close();
    }
};

export const getSession = (): Session => {
    if (!driver) {
        throw new Error('Driver not initialized');
    }
    return driver.session();
};
