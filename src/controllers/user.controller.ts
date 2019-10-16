import express from 'express'

import User from '../models/user'

import { handleError } from '../utils/errors.utils'
import { authenticate } from '../config/passport.config'

const app = express();

app.get('/me', authenticate, (req, res) => res.send(req.user));

/*
app.post('/profile/refresh', authenticate, async (req, res) => {
    const { user } = req as { user: User }

    try {
        await user.refreshProfile();

        res.send(user);
    } catch(error) {
        handleError(error, res);
    }
});
*/

export default app