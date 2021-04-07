
## Run the project
    npm run publish

#### Initial Setup
Create a package.json file:

    npm init -y

Install initial dependencies:

    npm i typescript ts-node-dev node-nats-streaming @types/node

Generate a TS config file:

    tsc --init

Create a /src folder. Inside of it, create a publisher.ts file and a listener.ts file.

Create following scripts inside package.json:

```json
{
  ...
  "scripts": {
    "publish": "ts-node-dev --rs --notify false src/publisher.ts",
    "listen": "ts-node-dev --rs --notify false src/listener.ts"
  }
}
```
Write following content inside publisher.ts file:

```javascript
import nats from 'node-nats-streaming';

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');
});
```

To be able to connect the Nats Test project to the NATS Streaming Server running inside the cluster, run this commnad to expose the port of a pod (deployment):

    kubectl port-forward nats-deployment-64dc7cfd69-d8dvw 4222:4222

#### Dependencies Dictionary
* **node-nats-streaming**
  NATS Streaming Server is an extremely performant, lightweight reliable streaming platform powered by NATS.

* **typescript**

  TypeScript is a language for application-scale JavaScript. TypeScript adds optional types to JavaScript that support tools for large-scale JavaScript applications for any browser, for any host, on any OS. TypeScript compiles to readable, standards-based JavaScript.

* **ts-node-dev**

  It restarts target node process when any of required files changes but shares Typescript compilation process between restarts. This significantly increases speed of restarting comparing to nodemon -x ts-node... variations because there is no need to instantiate ts-node compilation each time.
