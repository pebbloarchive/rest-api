_***API*** - The core service used to handle REST and WS events_

## Docs
* [Info](#info)
    * [Status](#status)
* [Codebase](#codebase)
    * [Folder Structure](#folder-structure)
    * [First time setup](#first-time-setup)
        * [Installation](#installation)
        * [Background services](#background-services)
        * [Starting @risuto/api](#starting-@risuto/api)

## Info
`@risuto/api` is the core service used to handle requests from clients over REST and WebSocket.

Events such as chatting and user authentication are sent from `@risuto/api`.

### Status
`@risuto/api` has been actively developed internally since May 2019.

## Codebase
The codebase for `@risuto/api` is written in JavaScript, utilising TypeScript and Node.js. Express.js is used for our REST API, while the WebSocket API uses the `ws` module.

PostgreSQL is used as the primary database, while Redis is used for cache.

### Folder Structure
```
risuto/api/
└──┐ src # The core source code
   ├── config # Config files for Redis, Passport, etc
   ├── controllers # Our REST route controller files
   ├── models # Models for our a data types, such as users and rooms
   ├── schemas # Sequelize schema files
   ├── server # Our Express.js setup
   ├── services # Abstractions for Oauth2, etc
   └── utils # Helper methods
```

### First time setup
First, clone the `@risuto/api` repository locally:

```
git clone https://gitlab.com/risuto/api.git
```

#### Installation
The following services need to be installed for `@risuto/api` to function:

* PostgreSQL
* Redis

You also need to install the required dependencies, by running either:

```
npm install
```
or
```
yarn
```

Ensure that `.env-example` is either copied and renamed to `.env`, or is simply renamed to `.env`.

In this file, you'll need to supply the environment the app is running in under `NODE_ENV`, the key used to decrypt incoming requests over HTTP and WS, and the URI for MongoDB.

#### Background Services
Make sure that you have installed PostgreSQL and Redis, and they are both running locally on port 5432 and 6379 respectively.

The command to start PostgreSQL is `sudo service postgresql start`, and the command to start Redis is `redis-server`.

#### Starting @risuto/api
To run `@risuto/api` in development mode, run either:

```
npm run dev
```
or
```
yarn dev
```