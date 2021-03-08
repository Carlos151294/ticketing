
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

#### Dependencies Dictionary
* **ts-node-dev**

  It restarts target node process when any of required files changes but shares Typescript compilation process between restarts. This significantly increases speed of restarting comparing to nodemon -x ts-node... variations because there is no need to instantiate ts-node compilation each time.