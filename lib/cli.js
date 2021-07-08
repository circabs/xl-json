'use strict';

const Bossy = require('@hapi/bossy');
const Converter = require('./index.js');
const Common = require('./common.js');
const Path = require('path');
const Pkg = require('../package.json');
const Utils = require('basic-utils');


exports.run = function (args, cb) {

    const homePath = Common.getHomePath();
    let output = Path.join(homePath, '.xl-json/output');

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
            description: 'output directory to write json files to'
        },
        version: {
            alias: 'v',
            type: 'boolean',
            description: 'version information'
        }
    };

    const argv = Bossy.parse(definition, { argv: args });

    if (argv instanceof Error) {
        return cb(new Error(Bossy.usage(definition, 'xl-json [options]')), null);
    }

    if (argv.help) {
        return cb(null, Bossy.usage(definition, 'xl-json [options]'));
    }

    if (argv.version) {
        return cb(null, `Package ${Pkg.name} v${Pkg.version}`);
    }

    if (!argv.input) {
        return cb(new Error(Bossy.usage(definition, 'xl-json [options]')), null);
    }

    const input = Path.resolve(argv.input);

    if (argv.o) {
        output = Path.resolve(argv.o);
    }


    const options = {
        input,
        output,
        spacer: 4
    };

    if (argv.f) {
        const formatPath = Path.resolve(argv.f);
        try {
            options.formatters = require(formatPath);
        }
        catch (e) {
            return cb(new Error(`${e.message} due to require error code ${e.code}`), null);
        }
    }

    try {
        Utils.mkDirSync(output);
    }
    catch (e) {
        // $lab:coverage:off$
        return cb(new Error(`Failed to make output directory due to ${e.message} ${e.code}`), null);
        // $lab:coverage:on$
    }


    const converter = new Converter(options);
    converter.toJson({
        write: true
    });

    const response = `Loading excel sheet from location ${input}\nWriting json files to destination directory ${output}`;
    return cb(null, response);

};
