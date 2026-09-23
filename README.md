# Archivalia Digital E-Library Frontend

React + Vite frontend for the Spring Boot microservices project.

## Requirements
- Node.js 18+
- Spring Boot backend running through API Gateway on port 8080

## Run

Open this folder in VS Code, then terminal:

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually:

http://localhost:5173

## Backend

The frontend calls:

http://localhost:8080

Services should be running behind the API Gateway.

If the browser shows a CORS error, enable CORS in the Spring Cloud Gateway and allow:
http://localhost:5173
"# e-library-management" 
