import { Application } from 'express'

export default (app: Application) => {
    app.use('/auth', require('../controllers/auth.controller').default)
    app.use('/login', require('../controllers/login.controller').default)
    app.use('/profile', require('../controllers/user.controller').default)
}