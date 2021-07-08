'use strict';

module.exports = {

    salutation: function (data) {

        const results = [];
        for (let i = 0; i < data.length; ++i) {
            const obj = {};
            const oldObj = data[i];
            const keys = Object.keys(data[i]);
            for (let j = 0; j < keys.length; ++j) {
                const key = keys[j];
                const value = oldObj[key];
                if (key.indexOf(':') !== -1) {
                    const newKeys = key.split(':');
                    const newKey = newKeys[0];
                    const collection = newKeys[1];
                    if (newKey === 'roleA' || newKey === 'roleB') {
                        obj[newKey] = {
                            cn: collection,
                            q: {
                                sid: value
                            }
                        };
                    }
                    else {
                        obj[newKeys[1]] = value;
                    }
                }
                else {
                    obj[key] = value;
                }
            }

            results.push(obj);
        }

        return results;
    }
};

