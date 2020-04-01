import { createServer } from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import session from 'express-session';
import { resolve } from "path"
import { config } from "dotenv"
config({ path: resolve(__dirname, '../.env') });

const _config = require('../config.json');
const app = express();
const server = createServer(app);

app.use(bodyParser.json());

app.use(session({
    secret: _config.server.secret,
    resave: true,
    saveUninitialized: true,
}));

// global.database = new db(this);
// // @ts-ignore
// database.sync();
// // @ts-ignore
// database.users = db.database.databaseConnection.import('./schemas/user.schema');

/**
 const db = require('./db/database');
global.logger = require('./util/Logger');
global.database = new db(this);
database.connect()
global.database.users = database.databaseConnection.import('./db/models/user');
global.database.posts = database.databaseConnection.import('./db/models/post');
database.sync();
 */

const db = require('./db/database');
// const Logger = require('./util/Logger');
// @ts-ignore
global.logger = require('./util/Logger');
// @ts-ignore
global.database = new db(this);
// @ts-ignore
database.connect()
// @ts-ignore
global.database.users = database.databaseConnection.import('./db/models/user');
// @ts-ignore
global.database.posts = database.databaseConnection.import('./db/models/post');
// @ts-ignore
database.sync();

routes(app);

export default server;