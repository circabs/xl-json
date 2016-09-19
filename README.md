#xl-json

Converts a complete excel spreadsheet to json in either object, as file or stream to a pipeline.  Module only works for nodejs version 4 or higher

[![Current Version](https://img.shields.io/npm/v/xl-json.svg?maxAgge=1000)](https://www.npmjs.org/package/xl-json)
[![dependency Status](https://img.shields.io/david/circabs/xl-json.svg?maxAge=1000)](https://david-dm.org/circabs/xl-json)
[![devDependency Status](https://img.shields.io/david/dev/circabs/xl-json.svg?maxAge=1000)](https://david-dm.org/circabs/xl-json)
[![Build Status](https://travis-ci.org/circabs/xl-json.svg?branch=master)](https://travis-ci.org/circabs/xl-json)
[![Coveralls](https://img.shields.io/coveralls/circabs/xl-json.svg?maxAge=1000)](https://coveralls.io/github/circabs/xl-json)





### Install

````ShellSession

npm install xl-json

````

### Example

```js

const Converter = require('xl-json');


const options = {
    input: Path.resolve(__dirname, './test/excel/relationship.xlsx'),
    output: '../output/relationship',
    spacer: 2, // optional for JSON.stringify
    replacer: ['key'] // optional array or function to be passed to JSON.stringify
    formatter: {
        organisation: formatter
    } // optional object with keys representing the name of sheet within workbook you would like to format and the value is a function that takes one parameter which is an array of objects.  Defaults to standard format which doesn't affect parsing done by j module

};

const results = new Converter(options);

// return json stringified object with keys of object being the worksheet name

const jsonObj = results.toJson();



// Also exposes a stream which can be written or piped somewhere

results.streamSheet('customer').pipe(process.stdout);
results.streamBook().pipe(process.stdout);

```

### Cli usage
##### xl-json <options>

- `-i`, `--i` or `--input` to set the input path of excel file to be converted
- `-o`, `--o` or `--ouput` to select the destination for converted json to be written to
- `-f`, `--f` or `--formatters` location of formatters object to be used to parse excel
- `-v`, `--v` or `--version` will display the current version of package
- `-h` - will show usage of cli


###Todo

+ Add ability to parse, write and stream multiple spreadsheets
