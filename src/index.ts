import 'dotenv/config'
import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './resolvers/UserResolver'
import { createConnection } from 'typeorm'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { verify } from 'jsonwebtoken'
import { User } from './entity/User';
import { resolve } from 'path'
const { config } = require('dotenv')
config({ path: resolve(__dirname, '../.env') });

(async () => {
  const app = express()
  app.use(
    cors({
      credentials: true
    })
  )

  app.use(cookieParser())

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  })

  apolloServer.applyMiddleware({ app, cors: false, path: '/api/graphql/' })

  app.listen(1337, () => {
    console.log('Express server started on port 1337');
  })
})()
