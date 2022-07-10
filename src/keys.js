

const crypto = require('crypto');
const fs = require('fs');
const { getAllFiles } = require('./files.js');
const keyFolder = './data/keys';

const checkKeysFolder = () => {
    if (!fs.existsSync(keyFolder)) fs.mkdirSync(keyFolder);
};

const createKey = (req, res) => {

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

    return res.end(JSON.stringify({ publicKey, privateKey }, null, 4));

};

const getKeys = (req, res) => {
    checkKeysFolder();
    return res.end(JSON.stringify(getAllFiles(keyFolder)));
};

module.exports = app => {
    app.post('/keys/create-key', createKey);
    app.get('/keys', getKeys);
    return { createKey, getKeys };
};