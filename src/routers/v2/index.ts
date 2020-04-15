import { Router } from 'express';

const router = Router();

router.all('/health', (req, res) => {
   return res.send('Gateaway up and running');
})

export default router;