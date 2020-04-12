import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { resolve } from 'path';
if (process.env.NODE_ENV !== 'production') {
  const { config } = require('dotenv')
  config({ path: resolve(__dirname, '../.env') });
}

import v1 from './routers/v1';

const app = express();

const port = 3000;

const corsOption = {
  origin: ['http://localhost:1500', 'https://pebblo.org', 'https://dev.pebblo.org'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}

/**
 * Middlewares
 */
app.use(cors(corsOption));
app.use(json());
app.use(urlencoded({ extended: true }));

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
// const minio = require('./middleware/minio');
// @ts-ignore
// global.minio = new minio();

/**
 * Routers
 */
app.use('/v1', v1);

app.listen(port, () => {
  console.log(`API Running on port ${port}`)
});