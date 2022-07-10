
const color = require('chalk');

module.exports = tests => {

    const res = {
        end: end => console.log(color.green('end ->', end)),
        setHeader: (keyHeader, header) => console.log(color.green('setHeader ->', keyHeader, header)),
        status: status => {
            console.log(color.green('status ->', status));
            return {
                json: json => console.log(color.green('json ->', JSON.stringify(json, null, 4))),
                end: end => console.log(color.green('end ->', end))
            }
        }
    };

    return;


    console.log(color.yellow('test keys.getKeys'));
    tests.keys.getKeys(
        {},
        res
    );

    console.log(color.yellow('test keys.createKey'));
    tests.keys.createKey(
        {
            body: { passphrase: 'test', name: 'test' }
        },
        res
    );

};