import express from 'express';
import { authenticate } from '../config/passport.config';
// import { handleError } from '../utils/errors.utils';

// import Ban from '../models/user/ban';

// import StoredBan from '../schemas/ban.schema';

const app = express();

app.get('/auth', authenticate, (req, res) => res.send(req.user));

// app.post('/ban', authenticate, async (req, res) => {
//     const { id: userId, reason } = req.body
//     try {
//         const ban = await new Ban().create(userId, reason, req.user);

//         res.send(ban);
//     } catch(error) {
//         handleError(error, res);
//     }
// });

// app.delete('/ban/:id', authenticate, async (req, res) => {
//     const { id: banId } = req.params;
//     try {
//         const ban = await new Ban().load(banId);
//         await ban.setActive(false);

//         res.sendStatus(200);
//     } catch(error) {
//         handleError(error, res);
//     }
// });

export default app;