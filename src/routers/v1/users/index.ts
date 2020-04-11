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
    if(!attachments) attachments = [];
    if(!content || content.length < 1) return res.status(400).json({ error: 'No content was provided' });
    try {
        // @ts-ignore
        await database.client.query('INSERT INTO posts(id, author, content, attachments, likes, created_at) VALUES($1, $2, $3, $4, $5, $6)',  [v1(), req.user.payload.id, content, attachments, [], new Date()])
        .catch(err => console.error(err))
        .then(res.status(400));
        return res.status(200).json({ success: true, message: 'New post was created successfully' });
    } catch(err) {
        return res.status(400).json({ error: 'Unable to create new post' });
    }
});

router.delete('/posts/:id', token, async (req, res) => {
    try {
        // @ts-ignore
        let post = await database.client.query('SELECT * FROM posts WHERE id = $1', [req.params.id]).then(re => re.rows[0]);
        if(!post) return res.status(400).json({ success: false, error: 'Unable to delete that post' });
        res.status(200).json({ success: true, message: 'Post was successfully deleted' });
        // @ts-ignore
        await database.client.query('DELETE FROM posts WHERE id = $1', [req.params.id])
        .catch(err => console.error(err))
        .then(res.status(400));
    } catch(err) {
        return res.status(400).json({ error: 'Unable to delete that post' });
    }
});

router.get('/posts/:id', token, async (req, res) => {
    try {
        // @ts-ignore
        await database.client.query('SELECT * FROM posts WHERE id = $1', [req.params.id]).then(post => res.status(200).json({
            id: post.rows[0].id,
            author: post.rows[0].author,
            content: post.rows[0].content,
            attachments: post.rows[0].attachments,
            likes: post.rows[0].likes.length,
            created_at: post.rows[0].created_at
         }))
    } catch(err) {
        return res.status(400).json({ error: 'Unable to retrieve post information' });
    }
});

export default router;