'use strict';

// nodejs
import express from 'express';
import dotenv from 'dotenv';

// server modules
import { morganMiddleware } from '../../modules/morgan.js';
import { logger } from '../../modules/logger.js';

// buil dev env
import buildDev from './build-dev.js';
// api
import { keys } from '../../api/keys.js';
// server client render
import { views } from '../../modules/views.js';
// views
import keysManager from '../../client/keys-manager/server-render.js';

dotenv.config();
// logger.info(process.env);
const app = express();

app.use(express.json({ limit: '20MB' }));
app.use(morganMiddleware);

buildDev(app);
keys(app);
views(app, keysManager);

app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});
