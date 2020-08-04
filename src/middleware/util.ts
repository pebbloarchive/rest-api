import { v4 } from 'uuid';
import { sign } from 'jsonwebtoken';

export async function genAuthToken(payload: object) {
  return sign({ payload }, process.env.jwt_secret, {
    expiresIn: '15m'
  });
};

export async function genRefreshToken(payload: object) {
  return sign({ payload }, process.env.jwt_secret, {
    expiresIn: '7d'
  });
}

export async function isAdmin(user: string) {
  // @ts-ignore
  return await database.client.query('SELECT perms FROM users WHERE id = $1', [user])
  .then(req => req.rows[0]);
}
