pipeline {
    agent any

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

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh """
                    docker build -t ${DOCKER_IMAGE}:${BUILD_TAG} .
                    docker tag ${DOCKER_IMAGE}:${BUILD_TAG} ${DOCKER_IMAGE}:latest
                """
            }
        }

        stage('Test Docker Image') {
            steps {
                echo '🧪 Running tests inside Docker container...'
                sh """
                    docker run --rm ${DOCKER_IMAGE}:${BUILD_TAG} npm test
                """
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                sh """
                    # Stop and remove any old container
                    docker ps -a -q --filter "name=${APP_NAME}" | xargs -r docker stop || true
                    docker ps -a -q --filter "name=${APP_NAME}" | xargs -r docker rm || true

                    # Run new container
                    docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${DOCKER_IMAGE}:${BUILD_TAG}

                    # Wait for app to start
                    sleep 5

                    # Health check
                    curl -f http://localhost:3000/health || exit 1
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '✅ Verifying deployment...'
                sh """
                    docker ps | grep ${CONTAINER_NAME}
                    curl -s http://localhost:3000 | grep "Jenkins CI/CD Demo"
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
            sh "docker stop ${CONTAINER_NAME} || true"
            sh "docker rm ${CONTAINER_NAME} || true"
        }

        always {
            echo 'Cleaning up old images...'
            sh """
                docker images -q ${DOCKER_IMAGE} | grep -v ${BUILD_TAG} | grep -v latest | xargs -r docker rmi -f || true
            """
        }
    }
}
