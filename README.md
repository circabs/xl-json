#xl-json

Converts a complete excel spreadsheet to json and writes file out, optionally it can pipe one worksheet json stream to a pipeline  

[![Build Status](https://travis-ci.org/circabs/xl-json.svg?branch=master)](https://travis-ci.org/circabs/xl-json)
[![Current Version](https://img.shields.io/npm/v/xl-json.svg)](https://www.npmjs.org/package/xl-json)
![devDependencies](http://img.shields.io/david/dev/circabs/xl-json.svg)
[![Coverage Status](https://coveralls.io/repos/circabs/xl-json/badge.svg?branch=master&service=github)](https://coveralls.io/github/circabs/xl-json?branch=master)


### Install

````ShellSession

npm install xl-json

````

### Example

```js

var Converter = require('xl-json');


var options = {
    input: Path.resolve(__dirname, './test/excel/relationship.xlsx'),
    output: '../output/relationship',
    spacer: 2, // optional for JSON.stringify
    replacer: ['key'] // optional array or function to be passed to JSON.stringify
    formatter: formatter // optional to replace standard formatter

};

var results = new Converter(options);

// call writeFile to write out objects as json file for each worksheet in excel file

results.writeFile();

// Also exposes a stream which can be written or piped somewhere

results.streamSheet('customer').pipe(process.stdout);
results.streamBook().pipe(process.stdout);

```

###Todo

+ Separate file writing into own routine, plus option to write one sheet and multiple spreadsheets
+ Add travis for testing and improve testing of streams
+ Stream not just per sheet but per file or directory of files
