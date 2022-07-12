'use strict';

import color from 'chalk';

export const tests = tests => {

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

    // tests.keys.instanceStaticChainObj();

};