
### Run the project
    npm start

#### Initial Setup
Create a package.json file:

    npm init -y

Install initial dependencies:

    npm i express body-parser typescript ts-node-dev @types/express

Generate a TS config file:

    tsc --init

Create a src folder and an index.ts file with the following content:

```javascript
import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('Hi there!');
});

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

Create skaffold config file in the root directory to watch any k8s file changes and apply them to the cluster. Also to watch any /auth/src code changes and sync them with the appropriate running container inside of the cluster.

```yaml
apiVersion: skaffold/v2alpha3
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
        dockerfile: Dockerfile
      sync:
        manual:
          - src: 'src/**/*.ts'
            dest: .
```

Create an Ingress Service to route traffic to the auth service so we can test an initial endpoint for /api/users/currentuser.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-service
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/use-regex: 'true'
spec:
  rules:
    - host: ticketing.dev
      http:
        paths:
          - path: /api/users/?(.*)
            pathType: Prefix
            backend: 
              service:
                name: auth-service
                port: 
                  number: 3000
```
Edit your hosts file to map the traffic from localhost to ticketing.dev.
If you see the HTTPS chrome warning, type inside the browser "thisisunsafe".

If you want to update a package, for example @cfntickets/common, run the command:

    npm update @cfntickets/common

#### Dependencies Dictionary
* **express**
  
  Fast, unopinionated, minimalist web framework for node.

* **typescript**

  TypeScript is a language for application-scale JavaScript. TypeScript adds optional types to JavaScript that support tools for large-scale JavaScript applications for any browser, for any host, on any OS. TypeScript compiles to readable, standards-based JavaScript.

* **ts-node-dev**

  It restarts target node process when any of required files changes but shares Typescript compilation process between restarts. This significantly increases speed of restarting comparing to nodemon -x ts-node... variations because there is no need to instantiate ts-node compilation each time.

* **express-validator**

  It is a set of express.js middlewares that wraps validator.js validator and sanitizer functions.

* **express-async-errors**

  A dead simple ES6 async/await support hack for ExpressJS. This makes express to handle async errors easily.

* **mongoose**

  Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose is a tool to get access to MongoDB and work with data inside of it.

* **cookie-session**

  Simple cookie-based session middleware. Used to create and destroy sessions.
  A user session can be stored in two main ways with cookies: on the server or on the client. This module stores the session data on the client within a cookie, while a module like express-session stores only a session identifier on the client within a cookie and stores the session data on the server, typically in a database.
  Used to create and destroy sessions.

* **jsonwebtoken**

  An implementation of JSON Web Tokens. Used to create JWTs (sign tokens) and verify they're valid.

##### Dev Dependencies 

* **jest**

  Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

* **ts-jest**

  A TypeScript preprocessor with source map support for Jest that lets you use Jest to test projects written in TypeScript.

* **supertest**

  SuperTest is used to make fake HTTP requests to our express app.

* **mongodb-memory-server**

  This package spins up an actual/real MongoDB server programmatically from node, for testing or mocking during development. By default it holds the data in memory. A fresh spun up mongod process takes about 7Mb of memory. The server will allow you to connect your favorite ODM or client library to the MongoDB server and run integration tests isolated from each other..
