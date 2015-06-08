// Load modules

var Code = require('code');
var Lab = require('lab');
var Path = require('path');
var Readable = require('stream').Readable;
var Converter = require('../lib/index.js');
var StdMocks = require('std-mocks');


// Set-up lab
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('Convert', function () {


    it('should throw if not constructed with new', function (done) {


        var fn = function () {

            var convert = Converter();
        };

        expect(fn).throws(Error, 'XlJson must be constructed using new');
        done();

    });

    it('should throw if options is not an object', function (done) {

        var fn = function () {

            var convert = new Converter();
        };

        expect(fn).throws(Error, 'XlJson must be constructed with an options object');
        done();

    });

    it('should throw if input file doesn\t exist', function (done) {

        var fn = function () {

            var convert = new Converter({
                input: Path.resolve(__dirname, '../test/excel/relationship.xls')
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

    it('should have settings defined', function (done) {

        var parser = new Converter({
            input: Path.resolve(__dirname, '../test/excel/relationship.xlsx'),
            output: Path.resolve(__dirname, '../test/output/relationship'),
            spacer: 2

        });

        expect(parser.settings).to.be.an.object();
        done();

    });

    it('should have data object defined', function (done) {

        var parser = new Converter({
            input: '../test/excel/relationship.xlsx',
            output: '../test/output/relationship',
            spacer: 4

        });

        expect(parser.data).to.be.an.object();
        expect(parser.settings).to.be.an.object();
        expect(parser.settings.spacer).to.equal(4);
        done();

    });

    it('should have expose a cursor stream', function (done) {

        var parser = new Converter({
            input: '../test/excel/relationship.xlsx',
            output: '../test/output/relationship',
            spacer: 4

        });

        StdMocks.use();
        parser.cursor('employment').pipe(process.stdout);
        StdMocks.restore();
        var test = StdMocks.flush();
        expect(test.stdout[0]).to.equal(test.stdout[1]);
        done();

    });




});
