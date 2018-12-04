pipeline {
  agent any
  stages {
    stage('Get coriolis-data') {
      steps {
        sh '''cd ..
git clone https://github.com/edcd/coriolis-data.git'''
      }
    }
  }
}