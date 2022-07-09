

const crypto = require('crypto');
const fs = require('fs');

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


    if (!fs.existsSync('./data/keys')) fs.mkdirSync('./data/keys');

    const timeStamp = (+ new Date());

    fs.mkdirSync(`./data/keys/${timeStamp}`);
    fs.writeFileSync(`./data/keys/${timeStamp}/public.pem`, publicKey, 'utf8');
    fs.writeFileSync(`./data/keys/${timeStamp}/private.pem`, privateKey, 'utf8');

    return res.end(JSON.stringify({ publicKey, privateKey }, null, 4));

};

module.exports = app => {
    app.post('/create-key', createKey);
    return { createKey };
};