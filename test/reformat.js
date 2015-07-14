

module.exports = function (data) {

    var results = [];
    for (var a = 0; a < data.length; ++a) {
        var obj = {};
        var oldObj = data[a];
        var keys = Object.keys(data[a]);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var value = oldObj[key];
            if (key.indexOf(':') !== -1) {
                var newKeys = key.split(':');
                var newKey = newKeys[0];
                var collection = newKeys[1];
                if (newKey === 'roleA' || newKey === 'roleB') {
                    obj[newKey] = {
                        cn: collection,
                        q: {
                            sid: value
                        }
                    };
                } else {
                    obj[newKeys[1]] = value;
                }
            } else {
                obj[key] = value;
            }
        }
        results.push(obj);
    }
    return results;
};
