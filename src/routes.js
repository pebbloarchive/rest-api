const { Application } = require('express');

module.exports = (app = Application) => {
    // app.use('/auth', require('../controllers/auth.controller'))
    app.use('/api/v1', require('./controllers/test.controller'));
    app.use('/api/v1/users', require('./controllers/users.controller'));
}