'use strict';

import express from 'express';

import { morganMiddleware } from './morgan.js';
import { logger } from './logger.js';

const app = express();
const port = 5500;

app.use(express.json({ limit: '20MB' }));
app.use(morganMiddleware);

import { views } from './views.js';
import { keys } from './keys.js';
import { tests } from './tests.js';

const viewsInstance = views(app);
const keysInstance = keys(app);
const testInstance = tests({
    viewsInstance, keysInstance
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
