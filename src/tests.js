
const color = require('chalk');

module.exports = tests => {


    console.log(color.yellow("test keys.getKeys"));
    tests.keys.getKeys(
        { },
        {
            end: response => console.log(response)
        }
    );
        
    return;
    console.log(color.yellow("test keys.createKey"));
    tests.keys.createKey(
        {
            body: { passphrase: 'hola' }
        },
        {
            end: response => console.log(response)
        }
    );

};