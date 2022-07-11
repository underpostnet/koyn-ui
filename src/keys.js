'use strict';

import crypto from 'crypto';
import fs from 'fs';
import { getAllFiles } from './files.js';
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

        const folderName = req.body.name + '-' + (+ new Date());

        fs.mkdirSync(`./data/keys/${folderName}`);
        fs.writeFileSync(`./data/keys/${folderName}/public.pem`, publicKey, 'utf8');
        fs.writeFileSync(`./data/keys/${folderName}/private.pem`, privateKey, 'utf8');


        // https://restfulapi.net/http-status-codes/
        return res.status(200).json({
            status: 'success',
            data: {
                publicKey,
                privateKey
            }
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
            data: getAllFiles(keyFolder).map( key => {
                return {
                    name: key.split('\\')[2].split('-')[0],
                    date: new Date(parseInt(key.split('\\')[2].split('-')[1])).toISOString()
                }
            }).filter((v,i)=>i%2==0)
        })
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
    return { createKey, getKeys };
};