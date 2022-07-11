'use strict';

import crypto from 'crypto';
import fs from 'fs';
import { getAllFiles } from './files.js';
import { logger } from './logger.js';
const keyFolder = './data/keys';

const checkKeysFolder = () => {
    if (!fs.existsSync(keyFolder)) fs.mkdirSync(keyFolder);
};

const createKey = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {

        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa',
            {
                modulusLength: 4096,
                namedCurve: 'secp256k1',
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                    passphrase: req.body.passphrase
                }
            });


        checkKeysFolder();

        fs.mkdirSync(`./data/keys/${req.body.hashId}`);
        fs.writeFileSync(`./data/keys/${req.body.hashId}/public.pem`, publicKey, 'utf8');
        fs.writeFileSync(`./data/keys/${req.body.hashId}/private.pem`, privateKey, 'utf8');

        // https://restfulapi.net/http-status-codes/
        return res.status(200).json({
            status: 'success',
            data: [{ "Hash ID": req.body.hashId }]
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            data: error.message,
        });
    }

};

const getKeys = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        checkKeysFolder();
        return res.status(200).json({
            status: 'success',
            data: getAllFiles(keyFolder).map(key => {
                return {
                    "Hash ID": key.split('\\')[2]
                }
            }).filter((v, i) => i % 2 == 0)
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            data: error.message,
        });
    }

};

const getKey = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        
        checkKeysFolder();

        logger.info(req.params);
        
        const result = getAllFiles(keyFolder).map(key => {
            return {
                "Hash ID": key.split('\\')[2]
            }
        })
        .filter((v, i) => i % 2 == 0)
        .find(v=>v["Hash ID"]==req.params.hashId);

        if(result){
            return res.status(200).json({
                status: 'success',
                data: [result]
            });
        }
        return res.status(400).json({
            status: 'error',
            data: 'hashId does not exist'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            data: error.message,
        });
    }

};

export const keys = app => {
    app.post('/api/keys/create-key', createKey);
    app.get('/api/keys', getKeys);
    app.get('/api/key/:hashId', getKey);
    return { createKey, getKeys };
};