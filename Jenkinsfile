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

        stage('Install Node.js') {
            steps {
                echo '💻 Installing Node.js on Agent...'
                sh '''
                curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                apt-get install -y nodejs
                node -v
                npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo '✅ Running tests...'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${BUILD_TAG} ."
                    sh "docker tag ${DOCKER_IMAGE}:${BUILD_TAG} ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                script {
                    sh '''
                        docker ps -a | grep ${APP_NAME} | awk '{print $1}' | xargs -r docker stop || true
                        docker ps -a | grep ${APP_NAME} | awk '{print $1}' | xargs -r docker rm || true
                        docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${DOCKER_IMAGE}:${BUILD_TAG}
                        sleep 5
                        curl -f http://localhost:3000/health || exit 1
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '✅ Verifying deployment...'
                sh '''
                    docker ps | grep ${CONTAINER_NAME}
                    curl -s http://localhost:3000 | grep "Jenkins CI/CD Demo"
                '''
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
            sh "docker stop ${CONTAINER_NAME} 2>/dev/null || true"
            sh "docker rm ${CONTAINER_NAME} 2>/dev/null || true"
        }
        always {
            echo 'Cleaning up old images...'
            sh '''
                docker images | grep ${DOCKER_IMAGE} | grep -v latest | grep -v ${BUILD_TAG} | awk '{print $3}' | xargs -r docker rmi -f || true
            '''
        }
    }
}
