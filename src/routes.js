const { Application } = require('express');

module.exports = (app = Application) => {
    // app.use('/auth', require('../controllers/auth.controller'))
    app.use('/', require('./controllers/test.controller'));
}