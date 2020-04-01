import express from 'express'

import bcrypt from 'bcrypt';

import snowflake from '../util/Snowflake';

const app = express();

app.post('/', async (req, res,  next) => {
    const { username, password, email } = req.body;
    // check if params are provided in the request
    if(!email || !username || !password) 
        return res.status(400).json({ message: 'The username or password you entered did not match our records.', ok: false });
    // checking if the current user is in the database
    // @ts-ignore
    await database.users.findOne({ where: { email: email } }).then(async (user: any) => {
        if(user) {
            res.status(400).json({ message: 'That email is already taken.', ok: false });
            return next();
        }
        const userPassword = await bcrypt.hash(password, 10);
        // @ts-ignore
        // @ts-ignore
        await database.users.create({
            id: 1,
            email: email,
            password: userPassword,
            username: username,
            created_at: new Date().toString()
        }).then(() => {
            return res.json({ message: 'Successfully registered, you have been sent an email to verify.', ok: true });
            // @ts-ignore
        }).catch((err: any) => console.error(err)).then(res.status(400).json({ message: 'It seems something went wrong' }));
    });
});

export default app;