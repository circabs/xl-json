#xl-json

Converts a complete excel spreadsheet to json and writes file out, optionally it can pipe one worksheet json stream to a pipeline  

[![Build Status](https://travis-ci.org/simon-p-r/xl-json.svg?branch=master)](https://travis-ci.org/simon-p-r/xl-json)
[![Current Version](https://img.shields.io/npm/v/xl-json.svg)](https://www.npmjs.org/package/xl-json)
![devDependencies](http://img.shields.io/david/dev/simon-p-r/xl-json.svg)


### Install

````ShellSession

npm install xl-json

````

### Example

```js

var Converter = require('xl-json');

var formatter = function (arr) {

    var results = [];
    var obj = {};

    arr.map(function (type) {

        var sub = Object.keys(type);

        for (var i = 0; i < sub.length; i++) {
            var key = sub[i];
            var value = type[key];
            if (key.indexOf(':') !== -1) {
                var keys = key.split(':');
                var collection = keys[1];
                var name = keys[0];
                obj[name] = {
                    cn: collection,
                    q: {
                        sid: value
                    }
                };
                results.push(obj);

            } else {
                obj[key] = value;
                results.push(obj[key]);
            }
        }
    });
    return results;

};

var options = {
    input: Path.resolve(__dirname, './test/excel/relationship.xlsx'),
    output: '../output/relationship',
    spacer: 2, // optional for JSON.stringify
    replacer: ['key'] // optional array or function to be passed to JSON.stringify
    formatter: formatter // optional to replace standard formatter

};

var results = new Converter(options);

// module will write files out when run to output directory

results.cursor('customer').pipe(process.stdout);

// Also exposes a stream which can be written or piped somewhere

```

###Todo

+ Separate file writing into own routine, plus option to write one sheet and multiple spreadsheets
+ Add travis for testing and improve testing of streams
+ Stream not just per sheet but per file or directory of files
