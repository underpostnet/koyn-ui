'use strict';

import express from 'express';
import shell from 'shelljs';
import fs from 'fs';
import { morganMiddleware } from './morgan.js';
import { logger } from './logger.js';

[
    'underpost.net',
    'underpost-data-template'
].map(underpostModule => {
    if (fs.existsSync(`./${underpostModule}`)) {
        shell.cd(underpostModule);
        shell.exec(`git pull origin master`);
        shell.cd('..');
        return;
    }
    shell.exec(`git clone https://github.com/underpostnet/${underpostModule}`);
    return;
});

const app = express();
const port = 5500;

app.use(express.json({ limit: '20MB' }));
app.use(morganMiddleware);

import { views } from './views.js';
import { keys } from './keys.js';
import { tests } from './tests.js';

const viewsInstance = views(app);
const keysInstance = keys(app);

tests({
    views: viewsInstance, keys: keysInstance
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
