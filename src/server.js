'use strict';

import express from 'express';
import dotenv from 'dotenv';
import { morganMiddleware } from './morgan.js';
import { logger } from './logger.js';
import custom from './custom.js';

custom();

dotenv.config();
// logger.info(process.env);
const app = express();

app.use(express.json({ limit: '20MB' }));
app.use(morganMiddleware);

import { views } from './views.js';
import { keys } from './api/keys.js';

views(app);
keys(app);

app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});
