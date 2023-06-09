# BCNC GROUP IMAGE-TEST
Built from my own template.

In this repository, we have the REST API for image rendering.

For the MongoDB database, we will use a MongoDB Atlas instance in its sandbox version, so we don't have to set up anything locally.

## Table of Contents
- [Express TSOA Typescript Boilerplate](#express-tsoa-typescript-boilerplate)
  - [Table of Contents](#table-of-contents)
  - [Interesting Dependencies](#interesting-dependencies)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Swagger Documentation](#swagger-documentation)
    - [Available Scripts](#available-scripts)
- [API-REST File Tree](#api-rest-file-tree)
- [Testing](#testing)
- [Inspirations](#inspirations)
- [License](#license)


## Interesting Dependencies

- [TypeScript](https://www.typescriptlang.org/): Language

- [Express.js](https://expressjs.com/): Lightweight web server application framework

- [TSOA](https://tsoa-community.github.io/docs/getting-started.html): Clean Architecture Framework with integrated OpenAPI

- [TSyringe](https://github.com/microsoft/tsyringe): A lightweight dependency injection container for TypeScript/JavaScript for constructor injection.

- [Helmet](https://helmetjs.github.io): Secure Express apps by setting HTTP headers

- [Lodash](https://lodash.com): Utility library

- [Mongoose](https://mongoosejs.com): MongoDB Object Data Modeling (ODM)

- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express): Documentation generator & hosting

- [ESLint](https://eslint.org/): Linting and formatting code

- [Dotenv](https://github.com/motdotla/dotenv): Configuration of environment variables

- [EditorConfig](https://editorconfig.org/): Maintaining consistent coding style - TBC

- [Winston](https://github.com/winstonjs/winston): Logging

- [Morgan](https://github.com/expressjs/morgan#readme): HTTP request logger middleware

- [Jest](https://jestjs.io/): Testing

- [Serialize-error](https://github.com/sindresorhus/serialize-error): Serialize an Error object into a plain object

- [Supertest](https://github.com/visionmedia/supertest): High-level abstraction for testing HTTP

- [Nodemon](https://nodemon.io/): Hot reloading

- [Plop](https://plopjs.com/documentation/): Micro-generator framework to create Controllers, Models & Services

- [Husky](https://typicode.github.io/husky/#): Commit checker


## Getting Started

### Installation
It is recommended to install the following dependencies globally:
```ts-node```
```nodemon```
```tsoa```
1. Install the dependencies using yarn:
``` bash
yarn
```
2. Rename the file `.env.example` to `.env` (Edit the file if needed).

You can use the command:
```bash
cp .env.example to .env
```

3. Build the TSOA routes:
```bash
yarn build
```
4. Run the application with live reloading:
```bash
yarn dev
```
5. After that, go to:
```http://localhost:8089```

### Swagger Documentation

API Documentation is automatically generated and hosted under `/docs`

To update your API Documentation, you must modify the file `src/swagger.json`

As a note for image downloads, we have decided to use the filter by TaskId and desired width, with the three possible values:
- original
- 800


- 1024

Example download endpoint: ```http://localhost:8089/v1/image/{taskId}/original```

### Available Scripts
- `yarn build` - Build the routes and specs from TSOA and compile TypeScript.
- `yarn lint` - Lint your TypeScript code.
- `yarn lint:fix` - Lint and automatically fix your TypeScript code.
- `yarn dev` - Run the server locally.
- `yarn clean:routes` - Remove build, tsoa_generated, and coverage folders.
- `yarn clean:modules` - Remove node_modules.
- `yarn clean:all` - Execute `yarn clean:modules` & `yarn clean:routes`.
- `yarn test` - Run all tests.
- `yarn test:unit` - Run unit tests.
- `yarn test:integration` - Run integration tests.
- `yarn prepare:husky` - Prepare Husky hooks.

## API-REST File Tree
```src
 ┣ api
 ┃ ┗ v1
 ┃ ┃ ┣ images
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┗ find-image.dto.ts
 ┃ ┃ ┃ ┣ models
 ┃ ┃ ┃ ┃ ┣ image.model.ts
 ┃ ┃ ┃ ┃ ┗ image.schema.ts
 ┃ ┃ ┃ ┣ images.controller.ts
 ┃ ┃ ┃ ┗ images.service.ts
 ┃ ┃ ┗ tasks
 ┃ ┃ ┃ ┣ dto
 ┃ ┃ ┃ ┃ ┗ find-task.dto.ts
 ┃ ┃ ┃ ┣ models
 ┃ ┃ ┃ ┃ ┣ tasks.model.ts
 ┃ ┃ ┃ ┃ ┗ tasks.schema.ts
 ┃ ┃ ┃ ┣ tasks.controller.ts
 ┃ ┃ ┃ ┗ tasks.service.ts
 ┣ logging
 ┃ ┗ winstonLogger.ts
 ┣ middlewares
 ┃ ┣ apiErrors.ts
 ┃ ┣ authentication.ts
 ┃ ┗ morganLogger.ts
 ┣ tsoa_generated
 ┃ ┣ routes.ts
 ┃ ┗ swagger.json
 ┣ utils
 ┃ ┣ enum.ts
 ┃ ┣ file.ts
 ┃ ┣ httpErrors.ts
 ┃ ┗ sum.ts
 ┣ app.ts
 ┣ config.ts
 ┣ ioc.ts
 ┣ mongoose.ts
 ┣ server.ts
 ┗ swagger.json
 ```


## Testing
The tests have been created only for the TaskController controller using Jest and Supertest. As a result, coverage will be given to the tasks.controller and tasks.services parts

The tests are running on an instance of Mongo Atlas to avoid affecting the original database

 **Coverage over task code**

	tasks.controller:
		- % Stmts: 100
		- % Branch: 100
		- % Funcs 100
	tasks.service:
		- % Stmts: 95
		- % Branch: 100
		- % Funcs 100

Run the test using
```bash
yarn test
```

## Inspirations
- [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate)
- [danielfsouse/express-rest-boilerplate](https://github.com/danielfsousa/express-rest-boilerplate)
- [vassalloandrea/better-logs-for-exrpess](https://dev.to/vassalloandrea/better-logs-for-expressjs-using-winston-and-morgan-with-typescript-516n)
- [mert-turkmenoglu/dependency-injection-in-typescript](https://levelup.gitconnected.com/dependency-injection-in-typescript-2f66912d143c)

## License
[MIT](LICENSE.md)
