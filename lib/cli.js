'use strict';

const Bossy = require('bossy');
const Fs = require('fs');
const Converter = require('./index.js');
const Path = require('path');
const Pkg = require('../package.json');

const internals = {};

exports.run = function () {

    internals.output = Path.resolve(process.cwd(), 'output');

    const definition = {
        formatters: {
            alias: 'f',
            type: 'string',
            description: 'custom formatters to load for parsing data'
        },
        help: {
            alias: 'h',
            type: 'boolean',
            description: 'display usage options'
        },
        input: {
            alias: 'i',
            type: 'string',
            description: 'input directory to load excel worksheet from'
        },
        output: {
            alias: 'o',
            type: 'string',
            description: 'output directory to write json files to',
            default: internals.output
        },
        version: {
            alias: 'V',
            type: 'boolean',
            description: 'version information'
        }
    };

    const argv = Bossy.parse(definition);

    if (argv instanceof Error) {
        console.error(Bossy.usage(definition, 'xl-json [options]'));
        process.exit(1);
    }
    if (argv.help) {
        console.log(Bossy.usage(definition, 'xl-json [options]'));
        process.exit(0);
    }
    if (argv.version) {
        console.log(Pkg.version);
        process.exit(0);
    }
    if (!argv.input) {
        console.error(Bossy.usage(definition, 'xl-json [options]'));
        process.exit(1);
    }
    internals.input = Path.resolve(argv.input);
    if (argv.output) {
        internals.output = Path.resolve(argv.output);
    }
    if (argv.formatters) {
        internals.formatters = argv.formatters;
    }
    const options = {
        input: internals.input,
        output: internals.output,
        spacer: 4
    };
    if (internals.formatters) {
        options.formatters = require(Path.resolve(internals.fromatters));
    }
    const access = function (path) {

        try {
            Fs.accessSync(path);
            return true;
        }
        catch (e) {
            return false;
        }
    };

    if (!access(internals.output)) {
        try {
            Fs.mkdirSync(internals.output);
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    }
    const converter = new Converter(options);
    converter.toJson({
        write: true
    });
    console.log('Converting excel sheet from location',  internals.input);
    console.log('Writing json files to destination directory',  internals.output);
    process.exit(0);

};
