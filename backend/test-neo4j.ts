import { initDriver, closeDriver, getSession } from './src/config/database.js';

async function testConnection() {
    try {
        console.log('Testing Neo4j connection...');
        await initDriver();

        const session = getSession();
        const result = await session.run('RETURN "Hello, Neo4j!" AS greeting');

        const greeting = result.records[0].get('greeting');
        console.log(greeting);

        await session.close();
    } catch (error) {
        console.error('Connection failed:', error);
    } finally {
        await closeDriver();
    }
}

testConnection();
