import { Router, Response, Request } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  return res.send('hello world');
});

export default router;
