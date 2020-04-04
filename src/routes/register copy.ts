import express from 'express'

import bcrypt from 'bcrypt';

const snowflake = require('../util/Snowflake');

const sf = new snowflake.Snowflake()

const app = express();

app.post('/', async (req, res,  next) => {
    const { username, password, email } = req.body;
    // check if params are provided in the request
    if(!email || !username || !password) 
        return res.status(400).json({ message: 'The username or password you entered did not match our records.', ok: false });
    // checking if the current user is in the database
    // @ts-ignore
    const isUsername = await database.users.findOne({ where: { username: username } });
    // @ts-ignore
    await database.users.findOne({ where: { email: email } }).then(async (user: any) => {
        if(user) {
            res.status(400).json({ message: 'That email is already taken.', ok: false });
            return next();
        } else if(isUsername) {
            res.status(400).json({ message: 'That username is already taken.', ok: false });
            return next();
        }
        const userPassword = await bcrypt.hash(password, 10);
        // @ts-ignore
        await database.users.create({
            id: sf.gen(),
            email: email,
            password: userPassword,
            username: username,
            created_at: new Date().toString()
        }).then((user: string) => {
            if(user) return res.status(200).json({ message: 'Successfully registered, you have been sent an email to verify.', ok: true });
            // @ts-ignore
        }).catch((err: any) => console.error(err)).then(res.status(400).json({ message: 'It seems something went wrong' }));
    });
});

export default app;