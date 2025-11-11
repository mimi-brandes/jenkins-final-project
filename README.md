# Jenkins CI/CD Demo Project

This project demonstrates a complete CI/CD pipeline with:
- Node.js application
- Docker containerization
- Jenkins automation
- Automated testing
- Automated deployment

## How to run locally
```bash
npm install
npm start
```

## How to run with Docker
```bash
docker build -t jenkins-demo-app .
docker run -p 3000:3000 jenkins-demo-app
```