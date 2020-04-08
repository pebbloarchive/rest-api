import { Router } from 'express';
import token from '../../../middleware/token';
import { v4 } from 'uuid';

const router = Router();

router.post('/upload', token, async (req, res) => {

});

export default router;