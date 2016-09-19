'use strict';

const Code = require('code');
const Cli = require('../lib/cli');
const Lab = require('lab');
const Utils = require('basic-utils');

// Declare internals
const internals = {};

// Test shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const after = lab.after;

describe('Cli', () => {

    const outDir = './test/tmp';
    const inputDir = './test/excel/lookup.xlsx';
    const formatters = './test/reformat.js';

    after((done) => {

        Utils.rmDir('./test/tmp', (err) => {

            expect(err).to.not.exist();

            Utils.rmDir('./test/invalid', (err) => {

                expect(err).to.not.exist();
                done();
            });
        });
    });


    it('returns error when invalid args are used', (done) => {

        const errArgs = ['-invalid', 'args'];
        Cli.run(errArgs, (err, output) => {

            expect(err).to.exist();
            expect(output).to.not.exist();
            done();
        });
    });

    it('returns error when no input is used', (done) => {

        Cli.run([], (err, output) => {

            expect(err).to.exist();
            expect(output).to.not.exist();
            done();
        });
    });

    it('returns error when invalid formatter is used', (done) => {


        const args = ['-i', inputDir, '-f', './test/invalid.js'];
        Cli.run(args, (err, output) => {

            expect(err).to.exist();
            expect(output).to.not.exist();
            done();
        });
    });

    it('should show help when -h flag is called', (done) => {

        const helpArgs = ['-h'];
        Cli.run(helpArgs, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
            done();
        });
    });

    it('should show version of project when -v flag is called', (done) => {

        const versionArgs = ['-v'];
        Cli.run(versionArgs, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.contain('v');
            done();
        });
    });

    it('runs command to validate and persist all schemas to disk using default output path', (done) => {

        const args = ['-i', inputDir, '-f', formatters];
        Cli.run(args, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
            done();
        });
    });

    it('runs command to validate and persist all schemas to disk', (done) => {

        const args = ['-i', inputDir, '-o', outDir];
        Cli.run(args, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
            done();
        });
    });

    it('runs command to validate and persist all schemas to disk', (done) => {

        const args = ['-i', inputDir, '-o', './test/invalid'];
        Cli.run(args, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
            done();
        });
    });

});
