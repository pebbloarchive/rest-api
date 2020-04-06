import { Router } from 'express';
import token from '../../../middleware/token';
import { v1 } from 'uuid';

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
            return res.status(400).json({ error: 'Unable to retrieve user data, something went wrong.' });
        }
    }).catch(err => console.error(err)).then(res.status(400));
});

router.post('/posts/new', token, async (req, res) => {
    let { content, attachments } = req.body;
    res.status(200).json({ success: true, message: 'New post was created successfully' });
    if(!attachments) attachments = [];
    if(!content || content.length < 1) return res.status(400).json({ error: 'No content was provided' });
    // @ts-ignore
    await database.client.query('INSERT INTO posts(id, author, content, attachments, created_at) VALUES($1, $2, $3, $4, $5)', 
    // @ts-ignore
    [v1(), req.user.payload.id, content, attachments, new Date()])
    .catch(err => console.error(err)).then(res.status(400));
});

export default router;