pipeline {
    agent { label 'windows' }

    environment {
        APP_NAME = "jenkins-demo-app"
        DOCKER_IMAGE = "${APP_NAME}"
        BUILD_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = "${APP_NAME}-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from Git...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo '✅ Running tests...'
                bat 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                bat """
                docker build -t ${DOCKER_IMAGE}:${BUILD_TAG} .
                docker tag ${DOCKER_IMAGE}:${BUILD_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                bat """
                FOR /F "tokens=1" %%i IN ('docker ps -a -q --filter "name=${APP_NAME}"') DO docker stop %%i || REM
                FOR /F "tokens=1" %%i IN ('docker ps -a -q --filter "name=${APP_NAME}"') DO docker rm %%i || REM
                docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${DOCKER_IMAGE}:${BUILD_TAG}
                timeout /t 5
                curl -f http://localhost:3000/health || exit 1
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '✅ Verifying deployment...'
                bat """
                docker ps | findstr ${CONTAINER_NAME}
                curl -s http://localhost:3000 | findstr "Jenkins CI/CD Demo"
                """
            }
        }
    }

    post {
        success {
            echo """
            ✅✅✅ Pipeline Completed Successfully! ✅✅✅
            🚀 Application deployed and running on http://localhost:3000
            🐳 Docker image: ${DOCKER_IMAGE}:${BUILD_TAG}
            🎉 Build #${BUILD_NUMBER} is live!
            """
        }
        failure {
            echo '❌ Pipeline failed! Check the logs above.'
            bat "docker stop ${CONTAINER_NAME} 2>NUL || REM"
            bat "docker rm ${CONTAINER_NAME} 2>NUL || REM"
        }
        always {
            echo 'Cleaning up old images...'
            bat """
            FOR /F "tokens=1" %%i IN ('docker images -q ${DOCKER_IMAGE} ^| findstr /v ${BUILD_TAG} ^| findstr /v latest') DO docker rmi -f %%i || REM
            """
        }
    }
}
