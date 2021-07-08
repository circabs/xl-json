'use strict';

const Code = require('@hapi/code');
const Converter = require('../lib/index.js');
const Fs = require('fs');
const Lab = require('@hapi/lab');
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

    before(() => {

        Utils.mkDirSync(Path.resolve(__dirname, 'output/lookup'));
    });

    after(() => {

        Utils.rmDirSync(Path.resolve(__dirname, 'output'));
    });


    it('should throw if options is not an object', () => {

        expect(() => {

            new Converter();
        }).throws(Error, 'XlJson must be constructed with an options object');
    });

    it('should throw if input file does not exist', () => {

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
    });

    it('should create output directory if it does not exist', () => {

        const obj = {
            input: Path.resolve(__dirname, '../test/excel/relationship.xlsx'),
            output: Path.resolve(__dirname, 'invalid')
        };
        const parser = new Converter(obj);
        parser.toJson({ write: false });
        expect(parser).to.be.an.object();
        Utils.rmDirSync(Path.resolve(__dirname, 'invalid'));

    });

    it('should convert empty excel file into a json object', () => {

        const obj = {
            input: Path.resolve(__dirname, '../test/excel/empty.xlsx')
        };
        const parser = new Converter(obj);
        parser.toJson({ write: false });
        expect(parser).to.be.an.object();
    });

    it('should convert excel file into a json object with write file disabled', () => {

        options.formatters = Reformat;
        const parser = new Converter(options);
        parser.toJson({ write: false });
        expect(parser).to.be.an.object();
    });

    it('should write all sheets from workbook into files', () => {

        options.formatters = undefined;
        const parser = new Converter(options);
        parser.toJson({ write: true });
    });

    it('should have data object defined', () => {

        const parser = new Converter(options);
        expect(parser.data).to.be.an.object();
    });

    it('should throw if sheet does not exist', () => {

        const parser = new Converter(options);
        const fn = () => {

            parser.streamSheet('example').pipe(process.stdout);
        };

        expect(fn).throws(Error);
    });

    it('should stream a sheet and a workbook', () => {

        const parser = new Converter(options);
        const tmp = Os.tmpdir();
        const writeSheet = Fs.createWriteStream(Path.join(tmp, 'sheet.json'));
        const writeBook = Fs.createWriteStream(Path.join(tmp, 'book.json'));
        parser.streamSheet('salutation').pipe(writeSheet);
        parser.streamBook().pipe(writeBook);
    });




});
