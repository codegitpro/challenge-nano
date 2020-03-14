# Nansapp Backend

Test Project for Nanosapp for building RESTful APIs using Node.js, Express and MongoDB

## Features

 - ES2017 latest features like Async/Await
 - Following Airbnb best practices
 - CORS enabled
 - Uses [yarn](https://yarnpkg.com)
 - Express + MongoDB ([Mongoose](http://mongoosejs.com/))
 - [Docker](https://www.docker.com/) support
 - Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
 - Request validation with [joi](https://github.com/hapijs/joi)
 - Gzip compression with [compression](https://github.com/expressjs/compression)
 - Linting with [eslint](http://eslint.org)
 - Tests with [mocha](https://mochajs.org), [chai](http://chaijs.com) and [sinon](http://sinonjs.org)
 - Logging with [morgan](https://github.com/expressjs/morgan)
 - Authentication and Authorization with [passport](http://passportjs.org)
 - API documentation generation with [apidoc](http://apidocjs.com)

## API documentation
 - You can find API documentation at localhost:3000/docs after running locally

## Postman Import
 - Import postman collection file : postman_collection.json

## Running from public docker
[Docker hub page](https://hub.docker.com/r/andriiyuldashev/nanosapp-backend)
```bash
docker run --name nanosapp-backend -p 3000:3000 -e MONGO_URI=<mongo_uri> andriiyuldashev/nanosapp-backend
```
 
## Requirements

 - [Node v7.6+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
 - [Yarn](https://yarnpkg.com/en/docs/install)

## Getting Started

#### Clone the repo and make it yours:

```bash
git clone https://github.com/andrii-web/nanosapp-backend.git
cd nanosapp-backend
```

#### Install dependencies:

```bash
yarn
```

#### Set environment variables:

```bash
cp .env.example .env
```

## Running Locally

```bash
yarn dev
```

## Running in Production

```bash
yarn start
```

## Lint

```bash
# lint code with ESLint
yarn lint

# try to fix ESLint errors
yarn lint:fix

# lint and watch for changes
yarn lint:watch
```

## Test

```bash
# run all tests with Mocha
yarn test

# run unit tests
yarn test:unit

# run integration tests
yarn test:integration

# run all tests and watch for changes
yarn test:watch

# open nyc test coverage reports
yarn coverage
```

## Documentation

```bash
# generate and open api documentation
yarn docs
```

## Docker

```bash
# run container locally
yarn docker:dev

# run container in production
yarn docker:prod

# run tests
yarn docker:test
```

## Deploy
Replace Docker username with yours:

```bash
nano build.sh
```

Run deploy script:

```bash
yarn docker:push
```
