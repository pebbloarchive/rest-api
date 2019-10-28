const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { createServer } = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes');
const session = require('express-session');
const Database = require('./database');

const app = express();
createServer(app);

if(process.env.NODE_ENV.toUpperCase() === "DEV") {
  app.use(morgan('combine'));
}

app.use(bodyParser.json());

app.use(session({
    secret: process.env.SITE_SECRET,
    resave: true,
    saveUninitialized: true,
}));

// Initalizing a new database structure
global.database = new Database(this);
// Connecting to the database
database.connect();
// database.sync();
// Importing models
global.database.users = database.databaseConnection.import('./schemas/user.schema');
global.database.profiles = database.databaseConnection.import('./schemas/profile.schema');
global.snowflake = (d) => {
  let date = new Date();
  let unique = ((Math.random() *1000) +"").slice(-4)

  date = date.toISOString().replace(/[^0-9]/g, "").replace(date.getFullYear(),unique);
  if(d==date)
      date = UniqueValue(date);
  return date;
}

routes(app);

app.listen(process.env.PORT || 3000, () => console.log(require('fs').readFileSync('../logo.txt', 'utf8')));