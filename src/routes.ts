import { Application } from 'express'
const required = require('./util/Verified');

export default (app: Application) => {
    app.use('/', require('./routes/main').default);
    app.use('/auth/login', require('./routes/login').default);
    app.use('/auth/register', require('./routes/register').default);
    app.use((req, res) => {
        if (!req.route) {
            return res.status(400).json({ message: 'Invalid endpoint', error: 'Not found', errorCode: 404});
        }
    });
}