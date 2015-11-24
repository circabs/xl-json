'use strict';

const Code = require('code');
const Lab = require('lab');
const Path = require('path');
const Fs = require('fs');
const Os = require('os');
const Converter = require('../lib/index.js');
const Reformat = require('./reformat.js');

// Set-up lab
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const options = {
    input: Path.resolve(__dirname, '../test/excel/lookup.xlsx'),
    output: Path.resolve(__dirname, '../test/output/lookup'),
    spacer: 4
};

describe('Convert', () => {


    it('should throw if options is not an object', (done) => {

        expect(() => {

            new Converter();
        }).throws(Error, 'XlJson must be constructed with an options object');
        done();

    });

    it('should throw if input file does not exist', (done) => {

        const fn = () => {

            new Converter({
                input: 'invalid'
            });
        };

        expect(fn).throws(Error);
        done();

    });

    it('should throw if output directory does not exist', (done) => {

        const fn = () => {

            new Converter({
                input: Path.resolve(__dirname, '../test/excel/relationship.xlsx'),
                output: 'invalid'
            });
        };
        expect(fn).throws(Error);
        done();

    });

    it('should convert excel file into a json object with write file disabled', (done) => {

        options.formatter = {
            salutation: Reformat
        };
        const parser = new Converter(options);
        parser.toJson({ write: false });
        expect(parser).to.be.an.object();
        done();

    });

    it('should write all sheets from workbook into files', (done) => {

        const parser = new Converter(options);
        parser.toJson({ write: true });
        done();

    });

    it('should have data object defined', (done) => {

        const parser = new Converter(options);
        expect(parser.data).to.be.an.object();
        done();

    });

    it('should throw if sheet does not exist', (done) => {

        const parser = new Converter(options);
        const fn = () => {

            parser.streamSheet('example').pipe(process.stdout);
        };
        expect(fn).throws(Error);
        done();

    });

    it('should stream a sheet and a workbook', (done) => {

        const parser = new Converter(options);
        const tmp = Os.tmpDir();
        const writeSheet = Fs.createWriteStream(Path.join(tmp, 'sheet.json'));
        const writeBook = Fs.createWriteStream(Path.join(tmp, 'book.json'));
        parser.streamSheet('salutation').pipe(writeSheet);
        parser.streamBook().pipe(writeBook);
        done();

    });




});
