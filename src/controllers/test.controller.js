const express = require('express');

const bcrypt = require('bcrypt');

const sendgrid = require('sendgrid')(process.env.SENDGRID);

const crypto = require('crypto-random-string');

const app = express();

app.get('/', (req, res) => res.status(403).send('Sorry but you are unauthorized to visit this page.'));

app.post('/auth/register', async (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'Invalid paramaters provided.' })
    }
    // checking if the email is in the database
    await database.users.findOne({ where: { email: req.body.email } }).then(async user => {
        if(user) {
            res.send({ message: 'That email is already taken.' });
            return next();
        }
        let now = new Date();
        now.setMinutes(now.getMinutes() + 10);
        now = new Date(now);
        const userPassword = await bcrypt.hash(req.body.password, 10);
        database.users.create({
            id: snowflake(),
            email: req.body.email,
            password: userPassword,
            username: req.body.username,
            createdAt: new Date().toString(),
            emailToken: crypto({length: 25}),
            emailCreatedAt: new Date().toString(),
            emailExpiresAt: now
        }).then(user => {
            if(user) {
                // send email to the user.
                // const request = sendgrid.emptyRequest({
                //     method: 'POST',
                //     path: '/v3/mail/send',
                //     body: {
                //       personalizations: [
                //         {
                //           to: [
                //             {
                //               email: req.body.email
                //             }
                //           ],
                //           subject: 'pebblo.org email verification'
                //         }
                //       ],
                //       from: {
                //         email: 'no-reply@pebblo.org'
                //       },
                //       content: [
                //         {
                //           type: 'text/plain',
                //           value: `Go to https://pebblo.org/auth/email/verify/${tokenString} to verify your email`
                //         }
                //       ]
                //     }
                // });
                // // send the email request
                // sendgrid.API(request).then(() => {
                //     // return res.json({ message: 'User has been sent a email verification.' });
                // }).catch(error => res.json({ error: error }));
                return res.json({ message: `User sucessfully created, they have also been sent an email verification.` });
            } else {
                return res.json({ error: 'error lol' });
            }
        }).catch(err => res.json({ error: err }));
    });
});

app.post('/auth/login', async (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).send({ message: 'Invalid paramaters provided.' })
    }
    // checking if the email is in the database
    await database.users.findOne({ where: { email: req.body.email } }).then(user => {
        // if the user isn't in the database return an error
        if(!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }
        // or if the email isn't then return an error
        if(!user.verifiedEmail) {
            return res.status(400).json({ error: 'You have not verified your email yet.' });
        }
        // but if the user is in the database continue
        if(user) {
            // checking the provided password against the one in the database
            if(bcrypt.compareSync(req.body.password, user.password)) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 60 * 60 * 24 * 1000
                });
                return res.json({ message: 'yes' })
            } else {
                res.status(400).json({ error: 'Passwords did not match' })
            }
        }
    });
});

app.post('/auth/email/verify/:id', async(req, res) => {
    if(!req.body.email) {
        return res.status(400).send({ message: 'Invalid paramaters provided.' })
    }
    await database.users.findOne({ where : { email: req.body.email } }).then(async user => {
        if(!user) {
            return res.status(400).json({ error: 'That user does not exist.' });
        }
        if(user.verifiedEmail === true) {
            return res.status(400).json({ error: 'You have already verified your email.' });
        }
        if(req.body.id != user.tokenString) {
            return res.status(400).json({ error: 'Invalid email token provided.' });
        }
        if(new Date(user.emailExpiresAt).getTime() >= new Date(user.emailCreatedAt).getTime()) {
            return res.status(400).json({ error: 'The email token provided has expired.' });
        }
        // if the user is valid and so is the token verify them
        await database.users.update( { verifiedEmail: true } ,{ where: { email: req.body.email } });
        return res.json({ message: 'Email has been successfully verified.' });
    });
});

module.exports = app;