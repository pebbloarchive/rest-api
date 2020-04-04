import express from 'express'

import jwt from 'json-web-token';

import bcrypt from 'bcrypt';

const app = express();

app.post('/', async (req, res) => {
    const { username, password, email } = req.body;
    // check if params are provided in the request
    if(!username || !password) 
        return res.status(400).json({ message: 'The username or password you entered did not match our records.', ok: false });
    // checking if the current user is in the database
    // @ts-ignore
    await database.users.findOne({ where: { username: username } }).then(async user => {
        // if the user isn't in the database return an error
        if(!user)
            return res.status(400).json({ message: 'The username or password you entered did not match our records.', ok: false });
            // if the current user trying to sign in is suspended, don't allow them to sign in
        if(user.suspended === true)
            return res.status(400).json({ message: 'Unable to login due to your account being suspended.', ok: false });
        if(user) {
            // checking the provided password against the one in the database
            if(bcrypt.compareSync(req.body.password, user.password)) {
                const account = {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
                const payload = {
                    id: user.id,
                    email: user.email,
                    iat: new Date(new Date().getTime()+(1000*60*60*24*7))
                }
                // expires in 5 days
                await jwt.encode(process.env.jwt_secret as string, payload, 'HS256', (err, token) => {
                    if(err) return res.status(400).json({ err: err, ok: false });
                    return res.status(200).json({ message: 'Login successful', token: token, account: account, ok: true});
                });
            } else {
                return res.status(400).json({ message: 'Unable to login, passwords did not match', ok: false });
            }
        }
    });
});

export default app;