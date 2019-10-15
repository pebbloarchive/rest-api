import { Application } from 'express'

export default (app: Application) => {
    app.use('/user', require('../controllers/user.controller').default)
}