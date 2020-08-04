import { Router, Request, Response } from 'express';
import short from 'short-uuid';
import bcrypt from 'bcrypt';
import token from '../../../middleware/session';

const router = Router();

router.get('/user', async (req: Request, res: Response) => {
    try {
        if(req.query.name) {
            // @ts-ignore
            await database.client.query('SELECT * FROM users WHERE username = $1', [req.query.name]).then(async re => {
                return res.status(200).send({
                    id: re.rows[0].id,
                    username: re.rows[0].username,
                    avatar: re.rows[0].avatar,
                    bio: re.rows[0].bio,
                    vanity: re.rows[0].vanity,
                    created_at: re.rows[0].created_at,
                    updated_at: re.rows[0].updated_at,
                    is_verified: re.rows[0].is_verified,
                    is_private: re.rows[0].is_private,
                    permissions: re.rows[0].flags
                 });
            });
        } else if(req.query.id) {
            // @ts-ignore
            await database.client.query('SELECT * FROM users WHERE id = $1', [req.query.id]).then(async re => {
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
                    permissions: re.rows[0].flags
                 });
            });
            return res.status(401).send({ error: 'Invalid query was given.' });
        }
    } catch(err) {
        return res.status(404).send({ error: 'Unable to find that user.' });
    }
});

// TODO: make it so you can also filter things with query strings
// https://stackoverflow.com/questions/19020012/node-js-express-app-get-with-multiple-query-parameters

router.get('/@me', token, async (req: Request, res: Response) => {
    // @ts-ignore
    // let posts = await database.client.query('SELECT * FROM posts where ')
    // @ts-ignore
    await database.client.query('SELECT * FROM users where id = $1', [req.user.payload.id]).then(async re => {
        try {
            return res.status(200).json({
               id: re.rows[0].id,
               username: re.rows[0].username,
               avatar: re.rows[0].avatar,
               email: re.rows[0].email,
               bio: re.rows[0].bio,
               vanity: re.rows[0].vanity,
               created_at: re.rows[0].created_at,
               updated_at: re.rows[0].updated_at,
               is_verified: re.rows[0].is_verified,
               is_private: re.rows[0].is_private,
               permissions: re.rows[0].flags
            });
        } catch(err) {
            return res.status(400).json({ error: 'Unable to retrieve user data, something went wrong.' });
        }
    }).catch(err => console.error(err)).then(() => res.status(400));
});

router.post('/follow/:id', token, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        if(req.user.payload.id === req.params.id) return res.status(400).send({ error: 'You\'re unable to follow yourself' });
        // @ts-ignore
        await database.client.query('INSERT INTO following(sender, recipient, following) VALUES($1, $2, $3)', [req.user.payload.id, req.params.id, true]);
        // @ts-ignore
        await database.client.query('INSERT INTO followers(user_id, following_id) VALUES($1, $2)', [req.user.payload.id, req.params.id])
        .then(() => res.status(200).send({ message: 'Successfully followed user' }));
    } catch(err) {
        return res.status(400).json({ error: 'Unable to follow that user, something went wrong.' });
    }
});

router.post('/posts/new', token, async (req: Request, res: Response) => {
    let { content, attachments } = req.body;
    if(!attachments) attachments = [];
    if(!content || content.length < 1) return res.status(400).json({ error: 'No content was provided' });
    try {
        // @ts-ignore
        await database.client.query('INSERT INTO posts(id, author, content, attachments, likes, created_at) VALUES($1, $2, $3, $4, $5, $6)',  [short().new(), req.user.payload.id, content, attachments, [], new Date()])
        return res.status(200).json({ success: true, message: 'New post was created successfully' });
    } catch(err) {
        return res.status(400).json({ error: 'Unable to create new post' });
    }
});

router.delete('/posts/:id', token, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        let post = await database.client.query('SELECT * FROM posts WHERE id = $1', [req.params.id]).then(re => re.rows[0]);
        if(!post) return res.status(400).json({ error: 'Unable to delete that post' });
        // @ts-ignore
        if(req.payload.user.id != post.author) return res.status(400).send({ error: 'Unable to delete that post' });
        // @ts-ignore
        await database.client.query('DELETE FROM posts WHERE id = $1', [req.params.id])
        .then(() => res.status(200).json({ success: true, message: 'Post was successfully deleted' }));
    } catch(err) {
        return res.status(400).json({ error: 'Unable to delete that post' });
    }
});

router.post('/posts/edit/:id', token, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        let post = await database.client.query('SELECT * FROM posts WHERE id = $1', [req.params.id]).then(re => re.rows[0]);
        if(!post) return res.status(400).send({ error: 'Unable to delete that post' });
        // @ts-ignore
        if(req.user.payload.id != post.author) return res.status(400).send({ error: 'Unable to edit that post' });

        if(post.content === req.body.content) return res.status(400).send({ error: 'Unable to edit that post, because it has the same content as before' });

        if(req.body.content.length > 2000) res.status(400).send({ error: `Unable to edit post due to content being longer than 2000 characters. 2000/${req.body.content.length - 2000}` });
        // @ts-ignore
        await database.client.query('UPDATE posts SET content = $1, updated_at = $2 WHERE id = $3', [req.body.content, new Date(), req.params.id])
        .then(() => res.status(200).send({ message: 'Successfully updated post' }));
    } catch(err) {
        return res.status(400).send({ error: 'Unable to edit that post' });
    }
});

router.get('/posts/:id', async (req: Request, res: Response) => {
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

router.patch('/forgot/password', token, async (req: Request, res: Response) => {
    const { password, password2, payload } = req.body;
    if(!password && password2 && payload) return res.status(400).send({ error: 'Invalid request parameters were provided' });

    if(password2 !== password) return res.status(400).send({ error: 'Unable to change your password, passwords do not match' });

    if(payload === password2) return res.status(400).send({ error: 'You cannot use the same password' });

    try {
        if(!/^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(payload)) {
            return res.status(400).send({ error: 'Your password must be 8 characters or longer, and contain one uppercase character and a number' });
        }
        const userPassword = await bcrypt.hash(payload, 10);
        // @ts-ignore
      await database.client.query('UPDATE users SET password = $1 WHERE id = $2', [userPassword, req.user.payload.id]).catch((err: any) => console.error(err)).then(() => {
        return res.status(200).send({ message: 'Successfully updated your password' });
      });
    } catch(err) {
        return res.status(400).send({ error: 'It seems something went wrong' });
    }
});

router.patch('/update/username', token, async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if(!password) return res.status(400).send({ error: 'No password was provided.' });

    if(/(admin|trending|discover|explore|login|create|register|forgot|verify|pebblo|support|help|terms|privacy|timeline|explore|groups|account|settings|me)/.test(username)) {
        return res.status(400).send({ error: 'Sorry, but you are not allowed to use that username, as it contains a blacklisted name. More information can be found at https://help.pebblo.org/' });
    } else if(!/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/) {
        return res.status(400).send({ error: 'Your username must not be lower than 3 characters or be longer than 20 characters, and must follow the following format "user_name123"' });
    }

    // @ts-ignore
    const taken = await database.client.query('SELECT * FROM users where username = $1', [username]).then(res => res.rows[0]);

    if(taken) return res.status(400).send({ error: 'That username is already in use' });

    if(!taken) {
    // @ts-ignore
    await database.client.query('SELECT * FROM users WHERE id = $1', [req.user.payload.id]).then(async re => {
      if(bcrypt.compareSync(req.body.password, re.rows[0].password)) {
          // @ts-ignore
          await database.client.query('UPDATE users SET username = $1 WHERE id = $2', [username, req.user.payload.id])
          .then(() => res.status(200).send({ message: 'Your username was successfully changed' }));
      } else {
          return res.status(400).send({ error: 'Unable to change username due to passwords not matching' });
      }
    });
  }
});

router.patch('/update/@me', token, async (req: Request, res: Response) => {
    const { type, args, password } = req.body;

    if(!args && !type) return res.status(400).send({ error: 'Invalid request parameters were provided' });

    switch(type) {
        case 'private': {
            // if(!args === true || !args === false) return res.status(200).send({ error: 'Invalid request parameters were provided, looking for "true" or "false"' });
            // @ts-ignore
            await database.client.query('UPDATE users SET is_private = $1, updated_at = $2 WHERE id = $3', [args, new Date(), req.user.payload.id]).then(async () => {
                // @ts-ignore
                const query = await database.client.query('SELECT * FROM users WHERE id = $1', [req.user.payload.id]).then(async re => re.rows[0]);
                return res.status(200).send({ message: `Profile has been set to ${query.is_private ? 'private' : 'public'}` });
            }).catch(err => res.status(400).send({ error: 'It seems something went wrong' }));
            break;
        }
        case 'bio': {
            if(args.length > 200) res.status(400).send({ error: `Max character limit is 200. 200/${args.length - 200}` });
            // @ts-ignore
            await database.client.query('SELECT * FROM users WHERE password = $1', [password]).then(async pass => {
                if(bcrypt.compareSync(password, pass.rows[0].password)) {
                    // @ts-ignore
                    await database.client.query('UPDATE users SET bio = $1, updated_at = $2 WHERE id = $3', [args, new Date(), req.user.payload.id]).then(() => {
                        return res.status(200).send({ message: 'Your bio has been successfully updated' });
                    }).catch(err => res.status(400).send({ error: 'It seems something went wrong' }));
            }});
            break;
        }
        case 'email': {
            if(!args.includes('@') && !args.includes('.')) return res.status(400).send({ error: 'Emails must include @' });

            // @ts-ignore
            if(req.user.payload.email === args) return res.status(400).send({ error: 'You cannot use the same email' });

            // @ts-ignore
            const taken = await database.client.query('SELECT * FROM users where email = $1', [args]).then(res => res.rows[0]);

            if(taken) return res.status(400).send({ error: 'That email is already in use' });


            if(!taken) {
            // @ts-ignore
            await database.client.query('SELECT * FROM users WHERE id = $1', [req.user.payload.id]).then(async pass => {
                if(bcrypt.compareSync(password, pass.rows[0].password)) {
                    // @ts-ignore
                    await database.client.query('UPDATE users SET email = $1, updated_at = $2 WHERE id = $3', [args, new Date(), req.user.payload.id]).then(() => {
                        return res.status(200).send({ message: 'Your email has been successfully updated' });
                    })
            }}).catch(err => res.status(400).send({ error: 'It seems something went wrong' }));;
            break;
           }
        }
    }
});

export default router;
