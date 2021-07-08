'use strict';

const Assert = require('assert');
const Path = require('path');
const Flat = require('flat');
const Fs = require('fs');
const Readable = require('stream').Readable;
const Joi = require('@hapi/joi');
const Parse = require('xlsx');
const Utils = require('basic-utils');
const Common = require('./common.js');


const internals = { };

internals.defaults = {
    formatters: {
        '*': function (data) {

            const results = [];
            const delimiter = '::';
            for (let i = 0; i < data.length; ++i) {
                const row = data[i];
                const obj = Flat.unflatten(row, delimiter);
                results.push(obj);
            }

            return results;
        }
    },
    output: Path.join(Common.getHomePath(), '.xl-json/output')
};

internals.Schema = Joi.object({
    input: Joi.string().required(),
    output: Joi.string().required(),
    formatters: Joi.object().required().pattern(/^[a-zA-Z*]+$/, Joi.func().required()),
    replacer: Joi.alternatives().try(Joi.func(), Joi.array().default(null)),
    spacer: Joi.number().default(null)
});



module.exports = class XlJson  {

    constructor(options) {

        Assert(typeof options === 'object', 'XlJson must be constructed with an options object');
        this._settings = Utils.applyToDefaults(internals.defaults, options);
        Joi.assert(this._settings, internals.Schema, 'Invalid options passed to construct XlsJson');
        this.input = internals.buildPath(this._settings.input);
        if (!Utils.isFile(this.input)) {
            throw new Error(`Input path ${this.input} doesn\'t exist`);
        }

        this.output = internals.buildPath(this._settings.output);
        /* $lab:coverage:off$ */
        if (!Utils.isDir(this.output)) {
            try {
                Fs.mkdirSync(this.output);
            }
            catch (e) {
                throw new Error(`Output path ${this.output} doesn\'t exist and cannot be created`);
            }
        }
        /* $lab:coverage:on$ */

        const p = Parse.readFile(this.input);
        this.data = internals.worksheetToJson(p);
        this.sheets = Object.keys(this.data);
        return this;
    }

    toJson(options) {

        const replacer = this._settings.replacer;
        const spacer = this._settings.spacer;
        const sheets = this.sheets;
        const obj = {};
        for (let i = 0; i < sheets.length; ++i) {
            const name = sheets[i];
            const formatter = this._settings.formatters[name] || this._settings.formatters['*'];
            const sheet = this.data[name];
            const result = formatter(sheet);
            const jsonObj = JSON.stringify(result, replacer, spacer);
            obj[name] = jsonObj;
            if (options.write) {
                const fileName = Path.resolve(this.output, name + '.json');
                Fs.writeFileSync(fileName, jsonObj);
            }
        }

        return obj;

    }

    streamBook() {

        const rs = Readable();
        const recs = this.data;
        const replacer = this._settings.replacer;
        const spacer = this._settings.spacer;

        rs._read = () => {

            const keys = Object.keys(recs);
            for (let i = 0; i < keys.length; ++i) {
                const sheet = recs[keys[i]];
                for (let j = 0; j < sheet.length; ++j) {
                    const data = sheet[j];
                    rs.push(JSON.stringify(data, replacer, spacer) + '\n');
                }
            }

            rs.push(null);
        };

        return rs;
    }

    streamSheet(sheet) {

        if (this.sheets.indexOf(sheet) < 0) {
            throw new Error(`${sheet} is not a sheet in workbook`);
        }

        const rs = Readable();
        const recs = this.data[sheet];
        const replacer = this._settings.replacer;
        const spacer = this._settings.spacer;

        rs._read = function () {

            for (let i = 0; i < recs.length; ++i) {
                const data = recs[i];
                rs.push(JSON.stringify(data, replacer, spacer) + '\n');
            }

            rs.push(null);
        };

        return rs;
    }


};


internals.worksheetToJson = function (worksheet) {

    const result = {};
    worksheet.SheetNames.forEach((sheetName) => {

        const roa = Parse.utils.sheet_to_json(worksheet.Sheets[sheetName]);
        if (roa.length) {
            result[sheetName] = roa;
        }
    });

    return result;
};


internals.buildPath = function (directory) {

    if (!Path.isAbsolute(directory)) {
        directory = Path.resolve(__dirname, directory);
    }

    return directory;
};


