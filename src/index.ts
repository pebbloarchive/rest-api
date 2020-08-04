import 'dotenv/config'
import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './UserResolver'
import { createConnection } from 'typeorm'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { verify } from 'jsonwebtoken'
import { User } from './entity/User'
;(async () => {
  const app = express()
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )

  app.use(cookieParser())


  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () => {
    console.log('Express server started on port 4000')
  })
})()
