// Load modules

var Code = require('code');
var Lab = require('lab');
var Path = require('path');
var Fs = require('fs');
var Os = require('os');
var Converter = require('../lib/index.js');
var Reformat = require('./reformat.js');

// Set-up lab
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

var options = {
    input: Path.resolve(__dirname, '../test/excel/relationship.xlsx'),
    output: Path.resolve(__dirname, '../test/output/relationship'),
    spacer: 4
};

describe('Convert', function () {


    it('should throw if not constructed with new', function (done) {


        var fn = function () {

            var convert = Converter();
        };

        expect(fn).throws(Error, 'XlJson must be constructed using new');
        done();

    });

    it('should throw if options is not an object', function (done) {

        expect(function () {

            var convert = new Converter();
        }).throws(Error, 'XlJson must be constructed with an options object');
        done();

    });

    it('should throw if input file doesn\t exist', function (done) {

        var fn = function () {

            var convert = new Converter({
                input: 'invalid'
            });
        };

        expect(fn).throws(Error);
        done();

    });

    it('should throw if output directory doesn\t exist', function (done) {

        var fn = function () {

            var convert = new Converter({
                input: Path.resolve(__dirname, '../test/excel/relationship.xls'),
                output: 'invalid'
            });
        };
        expect(fn).throws(Error);
        done();

    });

    it('should convert excel file into a json object with write file disabled', function (done) {

        options.formatter = {
            organisation: Reformat
        };
        var parser = new Converter(options);
        var results = parser.toJson({ write: false });
        expect(parser).to.be.an.object();
        done();

    });

    it('should write all sheets from workbook into files', function (done) {

        options.formatter = {
            organisation: Reformat
        };
        var parser = new Converter(options);
        parser.toJson({ write: true });
        done();

    });

    it('should have data object defined', function (done) {

        var parser = new Converter(options);
        expect(parser.data).to.be.an.object();
        done();

    });

    it('should throw if sheet does not exist', function (done) {

        var parser = new Converter(options);
        var fn = function () {

            parser.streamSheet('example').pipe(process.stdout);
        };
        expect(fn).throws(Error);
        done();

    });

    it('should stream a sheet and a workbook', function (done) {

        var parser = new Converter(options);
        var tmp = Os.tmpDir();
        var writeSheet = Fs.createWriteStream(Path.join(tmp, 'sheet.json'));
        var writeBook = Fs.createWriteStream(Path.join(tmp, 'book.json'));
        parser.streamSheet('organisation').pipe(writeSheet);
        parser.streamBook().pipe(writeBook);
        done();

    });




});
