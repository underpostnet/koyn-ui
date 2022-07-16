'use strict';

import shell from 'shelljs';
import fs from 'fs';
import dotenv from 'dotenv';

const buildDev = (app) => {
    if (!fs.existsSync(`.env`)) fs.writeFileSync(`.env`, `PORT=5500
NODE_ENV=development`, 'utf8');

    dotenv.config();
    // logger.info(process.env);

    if (process.env.NODE_ENV == 'development') return;

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

    // app.use((req, res, next) => {
    //     console.log('Middleware:', Date.now());
    //     next();
    // });

};

export { buildDev };