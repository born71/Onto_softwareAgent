#!/bin/bash

echo "Starting Career Recommendation System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker Desktop first."
  exit 1
fi

echo "Building and starting containers..."
docker compose up --build -d

echo "Services started!"
echo "---------------------------------------------------"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo "Neo4j Database: http://localhost:7474 (User: neo4j, Pass: password)"
echo "---------------------------------------------------"
echo "Run 'docker compose logs -f' to see logs."
