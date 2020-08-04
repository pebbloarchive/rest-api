import jwt from 'jsonwebtoken';
// import redis
// maybe use the database too?
import { v4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';

export default async function session(req: Request, res: Response, next: NextFunction) {
  let token;
  if(!req.headers['authorization']) {
    return res.status(401).send({ error: 'Invalid authorization data was given.' });
  }
  if(!req.headers['authorization'].startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Invalid authorization data was given.' });
  }
  if(req.headers['authorization'].includes('Bearer ')) {
    token = req.headers['authorization'].split('Bearer ')[1];
  }
  await jwt.verify(token, process.env.jwt_secret as string, (err, data) => {
    if(err) return res.status(401).send({ error: 'Invalid authorization data was given.' });
    // @ts-ignore
    req.user = data as any;
    next();
  });
};
