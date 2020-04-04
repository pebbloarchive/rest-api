import express from 'express'

import bcrypt from 'bcrypt';

import jwt from 'json-web-token';

import { v4 } from 'uuid'

const app = express();

app.post('/', async (req, res,  next) => {
    const { username, password, email } = req.body;
    // check if params are provided in the request
    if(!email || !username || !password) 
        return res.status(400).json({ message: 'The username or password you entered did not match our records.', ok: false });
    // checking if the current user is in the database
    // @ts-ignore
    const isUsername = await database.client.query('SELECT * FROM users where username = $1', [username]).then(res => res.rows[0]);
    // @ts-ignore
    await database.client.query('SELECT * FROM users where email = $1', [email]).then(async (_res: any) => {
        if(_res.rows[0]) {
            res.status(400).json({ error: 'That email is already taken.' });
            return next();
        } else if(isUsername) {
            res.status(400).json({ error: 'That username is already taken.' });
            return next();
        }
        const userPassword = await bcrypt.hash(password, 10);
        const payload = {
            iat: Math.floor(new Date().setMinutes(new Date().getMinutes() + 10)/1000|0)
        }
        await jwt.encode(process.env.jwt_secret as string, payload, 'HS256', async (err, token) => {
            if(err) return res.status(400).json({ err: err });
            res.status(200).json({ message: 'Successfully registered, you have been sent an email to verify.', ok: true });
            // @ts-ignore
            await database.client.query(
                'INSERT INTO users(id, email, password, username, created_at, email_code) VALUES($1, $2, $3, $4, $5, $6)',
                [v4(), email, userPassword, username, new Date(), token])
            .catch((err: any) => console.error(err)).then(res.status(400).json({ error: 'It seems something went wrong' }));
        });
    });
});

export default app;