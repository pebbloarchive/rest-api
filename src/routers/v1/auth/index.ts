import { Router, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import short from 'short-uuid';
import token from '../../../middleware/token';
import { genRefreshToken } from '../../../middleware/util';

const router = Router();
const gravatar = require('gravatar-api');

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // check if params are provided in the request
  if(!email || !password)
      return res.status(400).json({ error: 'Email or password was not provided', success: false });
      // checking if the current user is in the database
      // @ts-ignore
  await database.client.query('SELECT * FROM users where email = $1', [email]).then(async _res => {
      // if the user isn't in the database return an error
      if(!_res.rows[0])
          return res.status(400).json({ error: 'The email or password you entered did not match our records.', success: false });
          // if the current user trying to sign in is suspended, don't allow them to sign in
      if(_res.rows[0].suspended === true)
          return res.status(400).json({ error: 'Unable to login due to your account being suspended.', success: false });
      if(_res.rows[0]) {
          // checking the provided password against the one in the database
          if(bcrypt.compareSync(req.body.password, _res.rows[0].password)) {
              const refresh_token_gen = require('crypto').randomBytes(10).toString('hex');
              // @ts-ignore
              await database.client.query('INSERT INTO tokens (user_id, session_id, token) VALUES ($1, $2, $3)',
              [_res.rows[0].id, require('crypto').randomBytes(10).toString('hex'), refresh_token_gen]);
              const account = {
                  id: _res.rows[0].id,
                  email: _res.rows[0].email,
                  username: _res.rows[0].username,
                  refresh_token: refresh_token_gen
              }
              const payload = {
                  id: _res.rows[0].id,
                  email: _res.rows[0].email,
                  iat: '5d'
                  // iat: new Date(new Date().getTime()+(1000*60*60*24*7))
              }
              // expires in 5 days
              await jwt.sign({ payload }, process.env.jwt_secret as string, { algorithm: 'HS256' }, (err, token) => {
                  if(err) return res.status(400).json({ err: err });
                  return res.status(200).json({ message: 'Login successful', token: token, account: account });
              });
          } else {
              return res.status(400).json({ error: 'Unable to login, passwords did not match', success: false });
          }
      }
  });
});

router.post('/register', async (req: Request, res: Response,  next) => {
  const { username, password, email } = req.body;

  const options = {
    email: email,
    parameters: { "size": "200", "d": "mm" }
  }
  // check if params are provided in the request
  if(!email || !username || !password)
      return res.status(400).json({ message: 'The username or password you entered did not match our records.', ok: false });
  // checking if the current user is in the database
  // @ts-ignore
  const isUsername = await database.client.query('SELECT * FROM users where username = $1', [username]).then(res => res.rows[0]);
  // @ts-ignore
  await database.client.query('SELECT * FROM users where email = $1', [email])
    .then(async (_res: any) => {
      if(_res.rows[0]) {
          res.status(400).json({ error: 'That email is already taken.' });
          return next();
      } else if(isUsername) {
          res.status(400).json({ error: 'That username is already taken.' });
          return next();
      }

      /**
      switch(username) {
        case /[!@#$%^&*()-+=`~{}\[\]\|;:\'"<,>/\?]+/.test(username):
          return res.status(400).json({ error: 'Sorry, Your username can only contain letters, numbers and \_.\'' });
        case /(admin|trending|discover|explore|login|create|register|forgot|verify|pebblo|support|help|terms|privacy|timeline|explore|groups|account|settings|me)/.test(username):
          return res.status(400).json({ error: 'Sorry, but you are not allowed to use that username, as it contains a blacklisted name. More information can be found at https://help.pebblo.org/' });
        case username.length <= 2:
          return res.status(400).json({ error: 'Sorry, but your username cannot be shorter than 2 characters' })
        case username.length >= 18:
          return res.status(400).json({ error: 'Sorry, but your username cannot be longer than 18 characters' })
      }
      */

      // if(/[!@#$%^&*()-+=`~{}\[\]\|;:\'"<,>/\?]+/.test(username)) {
      //       return res.status(400).json({ error: 'Sorry, Your username can only contain letters, numbers and \_.\'' });
      // } else if(/(admin|trending|discover|explore|login|create|register|forgot|verify|pebblo|support|help|terms|privacy|timeline|explore|groups|account|settings|me)/.test(username)) {
      //   return res.status(400).json({ error: 'Sorry, but you are not allowed to use that username, as it contains a blacklisted name. More information can be found at https://help.pebblo.org/' });
      // } else if(username.length <= 2) {
      //   return res.status(400).json({ error: 'Sorry, but your username cannot be shorter than 2 characters' })
      // } else if(username.length >= 18) {
      //   return res.status(400).json({ error: 'Sorry, but your username cannot be longer than 18 characters' })
      // } else if(!email.includes('@')) {
      //   return res.status(400).json({ error: 'Sorry, but emails must include @' });
      // }

      if(!/^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(password)) {
        res.status(400).send({ error: 'Your password must be 8 characters or longer, and contain one uppercase character and a number' });
      } else if(/(admin|trending|discover|explore|login|create|register|forgot|verify|pebblo|support|help|terms|privacy|timeline|explore|groups|account|settings|me)/.test(username)) {
          return res.status(400).send({ error: 'Sorry, but you are not allowed to use that username, as it contains a blacklisted name. More information can be found at https://help.pebblo.org/' });
      } else if(!/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/) {
          return res.status(400).send({ error: 'Your username must not be lower than 3 characters or be longer than 20 characters, and must follow the following format "user_name123"' });
      } else if(!email.includes('@')) {
          return res.status(400).send({ error: 'Emails must include @' });
      }

      const userPassword = await bcrypt.hash(password, 10);
      const payload = {
          iat: Math.floor(new Date().setMinutes(new Date().getMinutes() + 10)/1000|0)
      }
      await jwt.sign({ payload }, process.env.jwt_secret as string, { algorithm: 'HS256' }, async (err, token) => {
          if(err) return res.status(400).json({ err: err });
          res.status(200).json({ message: 'Successfully registered, you have been sent an email to verify.', ok: true });
          // @ts-ignore
          await database.client.query('INSERT INTO users(id, email, password, username, avatar, created_at, email_code) VALUES($1, $2, $3, $4, $5, $6, $7)',[short().new(), email, userPassword, username, gravatar.imageUrl(options), new Date(), token])
          .catch((err: any) => console.error(err)).then(() => res.status(400).json({ error: 'It seems something went wrong' }));
      });
  });
});

//router.post('/token/verify', async (req: Request, res: Response) => {
  //try {
    //await
  //} catch(err) {
    //return res.send({ error: 'It seems something went wrong.' });
  //}
//}

export default router;
