pipeline {
  agent any

  stages {
    stage('Docker Build & Deploy') {
      steps {
        sh 'docker compose down && docker compose up -d --build'
      }
    }
  }

  post {
    success { echo 'Pipeline completed successfully.' }
    failure { echo 'Pipeline failed.' }
  }
}
