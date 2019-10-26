const express = require('express');

const bcrypt = require('bcrypt');
const User = require('../schemas/user.schema');
const ID = require('../services/log.utils');

const app = express();

app.get('/', (req, res) => res.status(403).send('Sorry but you are unauthorized to visit this page.'));

app.post('/auth/register', async (req, res) => {
    await database.users.findOne({ where: { email: req.body.email } }).then(async user => {
        if(user) res.send({ message: 'That email is already taken.' });

        const userPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
            id: snowflake().toString(),
            email: req.body.email,
            password: userPassword,
            username: req.body.username,
            createdAt: Math.floor(Date.now() /1000)
        }
        database.users.create({
            id: snowflake(),
            email: req.body.email,
            password: userPassword,
            username: req.body.username,
            createdAt: Math.floor(Date.now() /1000)
        }).catch(res.json({ error: 'error lol' })).then(msg => console.log(msg));
    });
});

app.post('/auth/login', async (req, res) => {
    await database.users.findOne({ where: { email: req.body.email } }).then(user => {
        if(user) {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                // let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                //     expiresIn: 60 * 60 * 24 * 1000
                // });
                return res.json({ message: 'yes' })
            } else {
                res.status(400).json({ error: 'User does not exist' })
            }
        }
    });
});

module.exports = app;