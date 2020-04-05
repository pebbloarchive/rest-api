import { Router } from 'express';
import token from '../../../middleware/token';

const router = Router();

router.get('/@me', token, async (req, res) => {
    // @ts-ignore
    // let posts = await database.client.query('SELECT * FROM posts where ')
    // @ts-ignore
    await database.client.query('SELECT * FROM users where id = $1', [req.user.payload.id]).then(async re => {
        try {
            return res.status(200).json({
               id: re.rows[0].id,
               username: re.rows[0].username,
               avatar: re.rows[0].avatar,
               bio: re.rows[0].bio,
               vanity: re.rows[0].vanity,
               created_at: re.rows[0].created_at,
               updated_at: re.rows[0].updated_at,
               is_verified: re.rows[0].is_verified,
               is_private: re.rows[0].is_private, 
            });
        } catch(err) {
            return res.status(400).json({ error: 'Unable to retrieve user data, something went wrong.', err: err.stack });
        }
    }).catch(err => console.error(err)).then(res.status(400));
});

export default router;