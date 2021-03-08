
### Run the project
    npm start

#### Initial Setup
Creade a package.json file

    npm init -y

Install initial dependencies

    npm i typescript ts-node-dev express @types/express

Generate a TS config file

    tsc --init

First project steps:

  * Create src folder and a index.ts file
  * Create scripts:
    + start (starts the app in dev mode)
  * Create Dockerfile
  * Create a .dockerignore file to avoid loading up node_modules into the container when it's built.
  * Build image

    docker build -t dockerID/name .
  * Create infra folder and inside create k8s folder
  * Create an auth deployment file with deployment and service configuration (default service type is ClusterIP)
  * Create skaffold config file in the root directory to watch any k8s file changes and apply them to the cluster. Also watch any auth code changes and sync with the appropriate running container inside of the cluster.

  ```yaml
  apiVersion: skaffold/v2
  kind: Config
  deploy:
    kubectl:
      manifests:
        - ./infra/k8s/*
  build:
    local:
      push: false
    artifacts:
      - image: carlosfn224/auth
        context: auth
        docker:
          dockerfile: dockerfile
        sync:
          manual:
            - src: 'src/**/*.ts'
              dest: .
  ```
#### Dependencies Dictionary
* **ts-node-dev**

  It restarts target node process when any of required files changes but shares Typescript compilation process between restarts. This significantly increases speed of restarting comparing to nodemon -x ts-node... variations because there is no need to instantiate ts-node compilation each time.