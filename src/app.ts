import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { resolve } from 'path';
import { initEventManager } from './eventManager';
if (process.env.NODE_ENV !== 'production') {
  const { config } = require('dotenv')
  config({ path: resolve(__dirname, '../.env') });
}

import v1 from './routers/v1';
import v2 from './routers/v2';

const app = express();

const port = 3000;

/**
 * Middlewares/utils imports
 */
import minio from './middleware/minio';

/**
 * Middlewares
 */
const start: Function = async () => {
  try {
    const manager = await initEventManager();
    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(minio);
    app.use('/v1', v1);
    app.use('/v2', v2);
    app.listen(port, () => {
      console.log(`API Running on port ${port}. Sponsored by DogShitKyley69`);
    });
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

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
    is_verified bool,
    is_private bool,
    verified_email bool,
    bio varchar(500) default '',
    email_code varchar(500) default '',
    created_at date not null default current_date,
    updated_at date not null default current_date,
    verified_at date not null default current_date,
    admin bool default false,
    mod bool default false,
    suspended bool default false,
    suspended_date date not null default current_date,
    mfa bool default false,
    mfa_backup text []
    );
    CREATE TABLE IF NOT EXISTS "posts" (
      id varchar(200) not null primary key,
      author varchar(500) not null,
      content varchar(1500) not null,
      attachments text [] not null,
      likes text [] not null,
      created_at date not null default current_date,
      updated_at date not null default current_date
  );
  CREATE TABLE IF NOT EXISTS "following" (
    sender varchar(500) not null references users(id),
    recipient varchar(500) NOT null references users(id),
    following bool not null default false,
    primary key (sender, recipient)
  );
  CREATE TABLE IF NOT EXISTS "followers" (
      user_id varchar(500) not null references users(id),
      following_id varchar(500) not null references users(id),
      primary key (user_id, following_id)
  );

  CREATE TABLE IF NOT EXISTS "blocked" (
      user_id varchar(500) not null references users(id),
      blacklisted_id varchar(500) not null references users(id),
      primary key (user_id, blacklisted_id)
  );
`);
}

checkTables();
start();