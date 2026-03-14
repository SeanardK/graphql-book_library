pipeline {
  agent any

  stages {
    stage('Setup pnpm') {
      steps {
        sh 'pnpm -v || npm install -g pnpm'
      }
    }

    stage('Prepare .env') {
      steps {
        withCredentials([file(credentialsId: 'graphql-book_library_env', variable: 'ENV_FILE')]) {
          sh 'cp $ENV_FILE .env'
        }
      }
    }

    stage('Docker Build & Deploy') {
      steps {
        sh 'docker compose up -d --build'
      }
    }
  }

  post {
    success { echo 'Pipeline completed successfully.' }
    failure { echo 'Pipeline failed.' }
  }
}
