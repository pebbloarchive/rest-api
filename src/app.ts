import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { resolve } from 'path';
import Database from './postgres';

if (process.env.NODE_ENV !== 'production') {
  const { config } = require('dotenv')
  config({ path: resolve(__dirname, '../.env') });
}

import v1 from './routers/v1';

const app = express();

const port: number = 3000;

const corsOption = {
  origin: ['http://localhost:1500', 'https://pebblo.org', 'https://dev.pebblo.org'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}

/**
 * Middlewares/utils imports
 */
// import minio from './middleware/minio';

/**
 * Middlewares
 */
app.use(cors()); // cors are breaking right now or some shit https://quak.ovh/21DfwYW.png
app.use(json());
app.use(urlencoded({ extended: true }));
// app.use(minio);

/**
 * Database
 */
const db = require('./postgres');
// @ts-ignore
global.database = new db();
// @ts-ignore
database.connect();

const checkTables = async () => {
  // @ts-ignore
  await database.client.query(`CREATE TABLE IF NOT EXISTS "users"(
    id varchar(200) not null primary key,
    username varchar(24) not null,
    name varchar(100) default '',
    avatar varchar(80) default '',
    password varchar(200) not null,
    vanity varchar(24) default '',
    email varchar(128) not null,
    is_verified bool default false,
    is_private bool default false,
    verified_email bool default false,
    bio varchar(500) default '',
    email_code varchar(500) default '',
    created_at date not null default current_date,
    updated_at date not null default current_date,
    verified_at date not null default current_date,
    flags: 0,
    suspended bool default false,
    suspended_date date not null default current_date,
    mfa bool default false,
    mfa_backup text []
    );
    CREATE TABLE IF NOT EXISTS "posts"(
      id varchar(200) not null primary key,
      author varchar(500) not null,
      content varchar(1500) not null,
      attachments text [] not null,
      likes text [] not null,
      created_at date not null default current_date,
      updated_at date not null default current_date
  );
`);
}

const checkOthers = async () => {
  // @ts-ignore
  await database.client.query(`CREATE TABLE IF NOT EXISTS "following"(
    sender varchar(500) not null references users(id),
    recipient varchar(500) NOT null references users(id),
    following bool not null default false,
    primary key (sender, recipient)
  );
  CREATE TABLE IF NOT EXISTS "followers"(
      user_id varchar(500) not null references users(id),
      following_id varchar(500) not null references users(id),
      primary key (user_id, following_id)
  );

  CREATE TABLE IF NOT EXISTS "blocked"(
      user_id varchar(500) not null references users(id),
      blacklisted_id varchar(500) not null references users(id),
      primary key (user_id, blacklisted_id)
  );
  CREATE TABLE IF NOT EXISTS "tokens"(
      user_id varchar(500) not null references users(id),
      session_id varchar(50),
      token varchar (30),
      created_at date not null default current_date,
      expired_at date,
      primary key (user_id, token)
  );
  `)
}

checkTables().then(() => checkOthers());

/**
 * Routers
 */
app.use('/kola', v1);

app.listen(port, () => {
  console.log(`API Running on port ${port}`)
});
