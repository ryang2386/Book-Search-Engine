import type { Request, Response } from 'express';
import express from 'express';
// import { dirname } from 'path';
const router = express.Router();

import path from 'node:path';

// import { fileURLToPath } from 'node:url';
// const __dirname = path.dirname(__filename);
const __dirname = new URL('.', import.meta.url).pathname;
import apiRoutes from './api/index.js';

router.use('/api', apiRoutes);

router.use(express.static(path.join(__dirname, '../../client/build')));

// serve up react front-end in production
router.use((_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

export default router;
