import { Router } from 'express'

import jwt from 'json-web-token';

import bcrypt from 'bcrypt';

const router = Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    // check if params are provided in the request
    if(!email || !password) 
        return res.status(400).json({ error: `email: ${email} password: ${password}`, status: 400 });
    // checking if the current user is in the database
    // @ts-ignore
    await database.client.query('SELECT * FROM users where email = $1', [email]).then(async _res => {
        // if the user isn't in the database return an error
        if(!_res.rows[0])
            return res.status(400).json({ error: 'The email or password you entered did not match our records.', status: 400 });
            // if the current user trying to sign in is suspended, don't allow them to sign in
        if(_res.rows[0].suspended === true)
            return res.status(400).json({ error: 'Unable to login due to your account being suspended.', status: 400 });
        if(_res.rows[0]) {
            // checking the provided password against the one in the database
            if(bcrypt.compareSync(req.body.password, _res.rows[0].password)) {
                const account = {
                    id: _res.rows[0].id,
                    email: _res.rows[0].email,
                    username: _res.rows[0].username
                }
                const payload = {
                    id: _res.rows[0].id,
                    email: _res.rows[0].email,
                    iat: new Date(new Date().getTime()+(1000*60*60*24*7))
                }
                // expires in 5 days
                await jwt.encode(process.env.jwt_secret as string, payload, 'HS256', (err, token) => {
                    if(err) return res.status(400).json({ err: err });
                    return res.status(200).json({ message: 'Login successful', token: token, account: account });
                });
            } else {
                return res.status(400).json({ error: 'Unable to login, passwords did not match', status: 400 });
            }
        }
    });
});

export default router;