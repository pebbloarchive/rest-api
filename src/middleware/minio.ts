import { Client } from 'minio';
import { Request, Response, NextFunction } from 'express';

const client = new Client({
  endPoint: process.env.MINIO_ENDPOINT as string,
  port: 443,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESSKEY as string,
  secretKey: process.env.MINIO_SECRETKEY as string,
  region: 'eu-west1'
});

const init = (req: Request, res: Response, next: NextFunction) => {
  (req as any).storage = client;
  next();
}

export default init
export const minio = client;