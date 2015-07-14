#xl-json

Converts a complete excel spreadsheet to json and writes file out, optionally it can pipe one worksheet json stream to a pipeline  

[![Build Status](https://travis-ci.org/circabs/xl-json.svg?branch=master)](https://travis-ci.org/circabs/xl-json)
[![Current Version](https://img.shields.io/npm/v/xl-json.svg)](https://www.npmjs.org/package/xl-json)
![devDependencies](http://img.shields.io/david/dev/circabs/xl-json.svg)


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
    formatter: {
        organisation: formatter
    } // optional object with keys representing the name of sheet within workbook you would like to format and the value is a function that takes one parameter which is an array of objects.  Defaults to standard format which doesn't affect parsing done by j module

};

var results = new Converter(options);

// call writeFiles to write out objects as json file for each worksheet in excel file

results.writeFiles();

// Also exposes a stream which can be written or piped somewhere

results.streamSheet('customer').pipe(process.stdout);
results.streamBook().pipe(process.stdout);

```

###Todo

+ Add ability to parse, write and stream multiple spreadsheets
