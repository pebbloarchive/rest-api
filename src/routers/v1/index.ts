import { Router } from 'express';

const router = Router();

import authRouter from './auth';
import userRouter from './users';
import fileRouter from './users';
import twitchRouter from './oauth/twitch';

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/file', fileRouter);
router.use('/oauth/twitch', twitchRouter);

router.all('/health', (req, res) => {
   return res.send('API v1 is up');
})

export default router;