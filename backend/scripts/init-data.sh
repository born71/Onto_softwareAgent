#!/bin/bash

# Wait for Neo4j to be ready
echo "Waiting for Neo4j to be ready..."
docker compose exec neo4j cypher-shell -u neo4j -p password "RETURN 1" > /dev/null
while [ $? -ne 0 ]; do
    sleep 2
    echo "Waiting for Neo4j..."
    docker compose exec neo4j cypher-shell -u neo4j -p password "RETURN 1" > /dev/null 2>&1
done

echo "Neo4j is ready! Initializing data..."

# Run the initialization script
docker compose exec neo4j cypher-shell -u neo4j -p password -f /var/lib/neo4j/import/init.cypher

echo "Data initialization complete!"