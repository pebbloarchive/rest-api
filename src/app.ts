import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { resolve } from 'path';
if (process.env.NODE_ENV !== 'production') {
  const { config } = require("dotenv")
  config({ path: resolve(__dirname, '../.env') });
}

import v1 from './routers/v1';

const app = express();

const port = process.env.PORT || 3000;

/**
 * Middlewares
 */
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.all('*', (req, res, next) => {
  console.log(
    'Caught a request',
    'Headers:',
    req.headers,
    'Body:',
    req.body
  )
  next();
})

/**
 * Database
 */
const db = require('./postgres');
// @ts-ignore
global.database = new db();
// @ts-ignore
database.connect(); 

/**
 * Minio Client
 */
const minio = require('./middleware/minio');
// @ts-ignore
global.minio = new minio();

/**
 * Routers
 */
app.use('/v1', v1);

app.listen(port, () => {
  console.log(`API Running on port ${port}`)
});