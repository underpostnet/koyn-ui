'use strict';

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import SHA256 from 'crypto-js/sha256.js';
import colors from 'colors';
import { getAllFiles } from './files.js';
import { logger } from './logger.js';
import { BlockChain } from '../underpost.net/underpost-modules-v1/koyn/class/blockChain.js';
const keyFolder = './data/keys';

const blockChainConfig = JSON.parse(fs.readFileSync(
    '../underpost-data-template/network/blockchain-config.json',
    'utf8'
));

const instanceStaticChainObj = async () => {

    const chainObj = new BlockChain({
        generation: blockChainConfig.constructor.generation,
        userConfig: {
            blocksToUndermine: 1,
            propagateBlock: true,
            bridgeUrl: blockChainConfig.constructor.userConfig.bridgeUrl,
            intervalBridgeMonitoring: 1000,
            zerosConstDifficulty: null,
            rewardAddress: '',
            blockChainDataPath: 'data/network/blockchain',
            // blockChainDataPath: '../data/network/blockchain',
            // blockChainDataPath: null,
            maxErrorAttempts: 5,
            RESTdelay: 1000,
            charset: 'utf-8',
            limitMbBlock: blockChainConfig.constructor.limitMbBlock,
            blockchain: blockChainConfig,
            dataDir: './',
            dataFolder: 'data/network',
            dev: true
        },
        validatorMode: true
    });

    // UPDATE CHAIN WITH BRIDGE
    await chainObj.setCurrentChain();
    const chain = chainObj.chain;
    const validateChain = await chainObj.globalValidateChain(chain);

    return { chainObj, chain, validateChain };
};


const encryptStringWithRsaPrivateKey = (toEncrypt, relativeOrAbsolutePathToPrivateKey, passphrase) => {
    const absolutePath = path.resolve(relativeOrAbsolutePathToPrivateKey);
    const privateKey = fs.readFileSync(absolutePath, 'utf8');
    const buffer = Buffer.from(toEncrypt);
    const encrypted = crypto.privateEncrypt({
        key: privateKey.toString(),
        passphrase: passphrase,
    }, buffer);
    return encrypted.toString('base64');
};

const decryptStringWithRsaPublicKey = (toDecrypt, relativeOrAbsolutePathtoPublicKey) => {
    const absolutePath = path.resolve(relativeOrAbsolutePathtoPublicKey);
    const publicKey = fs.readFileSync(absolutePath, 'utf8');
    const buffer = Buffer.from(toDecrypt, 'base64');
    const decrypted = crypto.publicDecrypt(publicKey, buffer);
    return decrypted.toString('utf8');
};

const getBase64AsymmetricPublicKeySignFromJSON = (data) => {
    return Buffer.from(JSON.stringify(data)).toString('base64');
};

const getJSONAsymmetricPublicKeySignFromBase64 = (data) => {
    return JSON.parse(Buffer.from(data, 'base64').toString());
};

const checkKeysFolder = () => {
    if (!fs.existsSync(keyFolder)) fs.mkdirSync(keyFolder);
};

const generateSignData = (req, dataTransaction) => {

    const publicDirPem = `./data/keys/${req.body.hashId}/public.pem`;
    const privateDirPem = `./data/keys/${req.body.hashId}/private.pem`;

    const publicKey = fs.readFileSync(publicDirPem);
    const privateKey = fs.readFileSync(privateDirPem);

    const publicBase64 = publicKey.toString('base64');

    let dataSign = {
        base64PublicKey: publicBase64,
        B64PUKSHA256: SHA256(publicBase64).toString(),
        timestamp: (+ new Date())
    };

    if (req.body.cyberiaAuthToken) dataSign = { AUTH_TOKEN: req.body.cyberiaAuthToken, ...dataSign };
    if (dataTransaction) dataSign = dataTransaction;

    return getBase64AsymmetricPublicKeySignFromJSON({
        data: dataSign,
        sign: encryptStringWithRsaPrivateKey(
            SHA256(
                JSON.stringify(dataSign)
            ).toString(),
            privateDirPem,
            req.body.passphrase
        )
    })

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
            data: [{ 'Hash ID': req.body.hashId }]
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
                    'Hash ID': key.split('\\')[2]
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
                'Hash ID': key.split('\\')[2]
            }
        })
            .filter((v, i) => i % 2 == 0)
            .find(v => v['Hash ID'] == req.params.hashId);

        if (result) {
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

const postCopyCyberia = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        checkKeysFolder();
        logger.info(req.body);
        /* validateDataTempKeyAsymmetricSign */
        return res.status(200).json({
            status: 'success',
            data: generateSignData(req)
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            status: 'error',
            data: error.message,
        });
    }
};

const postEmitLinkItemCyberia = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {

        const signCyberiaKey = await axios.get('https://www.cyberiaonline.com/koyn/cyberia-well-key');

        const sender = getJSONAsymmetricPublicKeySignFromBase64(
            generateSignData(req)
        );
        const receiver = signCyberiaKey.data;

        logger.info('sender ->');
        logger.info(sender);
        logger.info('receiver ->');
        logger.info(receiver);

        const { chainObj, chain, validateChain } = await instanceStaticChainObj();

        logger.info(req.body);
        logger.info(validateChain);

        if (validateChain.global == true) {

            const tempDataTransactions = await axios.get(
                blockChainConfig.constructor.userConfig.bridgeUrl +
                '/transactions/' + blockChainConfig.constructor.generation);

            const objAmount = await chainObj.currentAmountCalculator(
                sender.data.base64PublicKey,
                false,
                tempDataTransactions.pool
            );

            console.log(
                colors.cyan(' > current total amount sender: ' + objAmount.amount)
            );


            if (req.body.amount > 0 && req.body.amount <= objAmount.amount) {

                console.log('generate transaction');

                const dataTransaction = {
                    sender: sender,
                    receiver: receiver,
                    amount: parseInt(req.body.amount),
                    subject: req.body.subject,
                    createdDate: (+ new Date())
                };

                console.log(' data transaction ->');
                console.log(dataTransaction);

                const endObjTransaction = getJSONAsymmetricPublicKeySignFromBase64(
                    generateSignData(req, dataTransaction)
                );

                logger.info(' endObjTransaction ->');
                logger.info(endObjTransaction);


                const endPointTransaction = blockChainConfig.constructor.userConfig.bridgeUrl + '/transactions/'
                    + blockChainConfig.constructor.generation;

                const postTransactionStatus =
                    await new Promise((resolve, reject) => axios.post(endPointTransaction, endObjTransaction)
                        .then(function (response) {
                            console.log(endPointTransaction, response);
                            resolve(response);
                        })
                        .catch(function (error) {
                            console.log(endPointTransaction, error);
                            reject(error);
                        }));

                console.log('postTransactionStatus ->');
                console.log(postTransactionStatus);
                return res.status(200).json({
                    status: 'success',
                    data: postTransactionStatus.data
                });



            } else {
                return res.status(400).json({
                    status: 'error',
                    data: 'insufficient or invalid current amount: ' + sender_amount,
                });
            }
        }
        return res.status(500).json({
            status: 'error',
            data: 'invalid blockchain config',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            data: error.message,
        });
    }

}

export const keys = app => {
    app.post('/api/keys/create-key', createKey);
    app.get('/api/keys', getKeys);
    app.get('/api/key/:hashId', getKey);
    app.post('/api/key/copy-cyberia', postCopyCyberia);
    app.post('/api/transaction/cyberia-link-item', postEmitLinkItemCyberia);
    return { createKey, getKeys, postEmitLinkItemCyberia, instanceStaticChainObj };
};