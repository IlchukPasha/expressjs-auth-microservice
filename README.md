# Social network auth microservice
Based on [express.js](https://expressjs.com/), [objection](https://vincit.github.io/objection.js/) and [knex](https://knexjs.org/).<br>
Requirements:
- [docker-ce](https://docs.docker.com/)
- [docker-compose](https://github.com/docker/compose/releases)

## Installing / Getting started

```bash
$ git clone git@github.com:IlchukPasha/lib-api-auth-microservice.git
$ cd {project_folder}/
$ make up
$ make db-refresh
$ yarn
$ yarn start
```
This command should up express.js http server

## Tests
```bash
$ yarn test
```

## Api Reference
In `development or testing mode` documentation located at `{your_site_url}/docs/`.

## Style guide
We use [airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) eslint preset

## Debug in docker
Configuration can be found here https://dev.to/alex_barashkov/how-to-debug-nodejs-in-a-docker-container-bhi
