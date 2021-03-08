
### Run the project
    npm start

#### Initial Setup
Create a package.json file:

    npm init -y

Install initial dependencies:

    npm i typescript ts-node-dev express @types/express

Generate a TS config file:

    tsc --init

Create a src folder and an index.ts file with the following content:

```javascript
import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
```

Create a start script inside package.json file:
`"start": "ts-node-dev src/index.ts"`
    
Create a Dockerfile:
```dockerfile
FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]
```

Create a .dockerignore file with the following content (to avoid loading up node_modules into the container when it's built).

```
node_modules
```

Build an image:

    docker build -t dockerID/auth .
Create an infra folder in the root directory and create a k8s folder inside.

Create an auth deployment file with deployment and service configuration (default service type is ClusterIP):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: 
  name: auth-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth
  template:
    metadata: 
      labels: 
        app: auth
    spec:
      containers:
        - name: auth
          image: carlosfn224/auth
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  selector:
    app: auth
  ports:
    - name: auth
      protocol: TCP
      port: 3000
      targetPort: 3000
```

Create skaffold config file in the root directory to watch any k8s file changes and apply them to the cluster. Also to watch any /auth/src code changes and sync with the appropriate running container inside of the cluster.

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