'use strict';

const Code = require('@hapi/code');
const Cli = require('../lib/cli');
const Lab = require('@hapi/lab');
const Path = require('path');
const Utils = require('basic-utils');
const Pkg = require('../package.json');

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

    after(() => {

        Utils.rmDir('./test/tmp', (err) => {

            expect(err).to.not.exist();

            Utils.rmDir('./test/invalid', (err) => {

                expect(err).to.not.exist();

                Utils.rmDir(Path.resolve(process.env.HOME, '.xl-json/output'), (err) => {

                    expect(err).to.not.exist();
                });
            });
        });
    });


    it('returns error when invalid args are used', () => {

        const errArgs = ['-invalid', 'args'];
        Cli.run(errArgs, (err, output) => {

            expect(err).to.exist();
            expect(output).to.not.exist();
        });
    });

    it('returns error when no input is used', () => {

        Cli.run([], (err, output) => {

            expect(err).to.exist();
            expect(output).to.not.exist();
        });
    });

    it('returns error when invalid formatter is used', () => {

        const args = ['-i', inputDir, '-f', './test/invalid.js'];
        Cli.run(args, (err, output) => {

            expect(err).to.exist();
            expect(output).to.not.exist();
        });
    });

    it('should show help when -h or --help flag is called', () => {

        Cli.run(['-h'], (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
            // Cli.run(['--help'], (err, output2) => {

            //     expect(err).to.not.exist();
            //     expect(output2).to.exist();
            // });
        });
    });

    it('should show version of project when -v or --version flag is called', () => {

        const version = `Package xl-json v${Pkg.version}`;
        Cli.run(['-v'], (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.equal(version);
            // Cli.run(['--version'], (err, output2) => {

            //     expect(err).to.not.exist();
            //     expect(output2).to.equal(version);
            // });
        });


    });

    it('runs command to validate and persist all schemas to disk using default output path', () => {

        const args = ['-i', inputDir, '-f', formatters];
        Cli.run(args, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
        });
    });

    it('runs command to validate and persist all schemas to disk', () => {

        const args = ['--input', inputDir, '-o', outDir];
        Cli.run(args, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
        });
    });

    it('runs command to validate and persist all schemas to disk', () => {

        const args = ['-i', inputDir, '-o', './test/invalid'];
        Cli.run(args, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
        });
    });

});
