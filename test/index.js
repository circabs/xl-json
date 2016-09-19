'use strict';

const Code = require('code');
const Converter = require('../lib/index.js');
const Fs = require('fs');
const Lab = require('lab');
const Os = require('os');
const Path = require('path');
const Reformat = require('./reformat.js');
const Utils = require('basic-utils');

// Set-up lab
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const before = lab.before;
const after = lab.after;

const options = {
    input: Path.resolve(__dirname, '../test/excel/lookup.xlsx'),
    output: Path.resolve(__dirname, '../test/output/lookup'),
    spacer: 4
};

describe('Convert', () => {

    before((done) => {

        Utils.mkDirSync(Path.resolve(__dirname, 'output/lookup'));
        done();
    });

    after((done) => {

        Utils.rmDirSync(Path.resolve(__dirname, 'output'));
        done();
    });


    it('should throw if options is not an object', (done) => {

        expect(() => {

            new Converter();
        }).throws(Error, 'XlJson must be constructed with an options object');
        done();

    });

    it('should throw if input file does not exist', (done) => {

        const invalid = () => {

            new Converter({
                input: 'invalid'
            });
        };
        expect(invalid).throws(Error);
        const isDir = () => {

            new Converter({
                input: Path.resolve(__dirname, '../test/excel')
            });
        };
        expect(isDir).throws(Error);
        done();

    });

    it('should throw if output directory does not exist', (done) => {

        const invalid = () => {

            new Converter({
                input: Path.resolve(__dirname, '../test/excel/relationship.xlsx'),
                output: 'invalid'
            });
        };
        expect(invalid).throws(Error);
        const isFile = () => {

            new Converter({
                input: Path.resolve(__dirname, '../test/excel/relationship.xlsx'),
                output: Path.resolve(__dirname, '../test/reformat.js')
            });
        };
        expect(isFile).throws(Error);
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
