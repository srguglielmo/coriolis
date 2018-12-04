pipeline {
  agent any
  stages {
    stage('Get coriolis-data') {
      steps {
        sh '''YES=`echo $GIT_BRANCH | awk -F / \'{print $2}\'`
export BRANCH=`git rev-parse --abbrev-ref $YES`
rm -rf $WORKSPACE/../coriolis-data
git clone https://github.com/edcd/coriolis-data.git $WORKSPACE/../coriolis-data
cd ../coriolis-data
git fetch --all
git checkout $BRANCH'''
      }
    }
    stage('Build') {
      sshagent (credentials: ['willb']) {
        sh 'ssh -o StrictHostKeyChecking=no 172.17.0.1 echo hi'
      }
    }
  }
}
