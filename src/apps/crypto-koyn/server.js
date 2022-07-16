'use strict';

// nodejs
import express from 'express';

// server modules
import { morganMiddleware } from '../../modules/morgan.js';
import { logger } from '../../modules/logger.js';

// buil dev env
import { buildDev } from './build-dev.js';
// api
import { apiKeys } from '../../api/keys.js';
import { apiUtil } from '../../api/util.js';
// server side client render
import { ssr } from '../../modules/views.js';
// views
import { viewMetaData, viewPaths } from '../../client/keys-manager/server-render.js';

const app = express();

app.use(express.json({ limit: '20MB' }));
app.use(morganMiddleware);

buildDev(app);
// apiUtil(app);
apiKeys(app);
ssr(app, { viewMetaData, viewPaths });

app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});
