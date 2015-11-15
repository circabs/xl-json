'use strict';

const Path = require('path');
const Fs = require('fs');
const Readable = require('stream').Readable;
const Hoek = require('hoek');
const Joi = require('joi');
const Parse = require('j');


const internals = {
    defaults: {
        formatter: {
            standard: function (obj) {

                return obj;
            }
        }
    },
    Schema: {
        input: Joi.string().required(),
        output: Joi.string().required(),
        formatter: Joi.object().required().pattern(/^[a-zA-Z]+$/, Joi.func().required()),
        replacer: Joi.alternatives().try(Joi.func(), Joi.array().default(null)),
        spacer: Joi.number().default(null)
    }
};



module.exports = internals.XlJson = class XlJson  {

    constructor(options) {

        Hoek.assert(typeof options === 'object', 'XlJson must be constructed with an options object');
        internals.settings = Hoek.applyToDefaults(internals.defaults, options);
        Joi.assert(this.settings, internals.Schema, 'Invalid options passed to construct XlsJson');
        const paths = this._normalize();
        if (!paths.input || !paths.output) {
            throw new Error('One of ' + internals.settings.input + ' or ' + internals.settings.output + ' are not valid directories to read and write from');
        }
        this.input = paths.input;
        this.output = paths.output;
        const p = Parse.readFile(this.input);
        this.data = Parse.utils.to_json(p);
        this.sheets = Object.keys(this.data);
        return this;
    }

    _normalize(dir) {

        const paths = [internals.settings.input, internals.settings.output];
        const retVal = {};
        for (let i = 0; i < paths.length; ++i) {

            if (!Path.isAbsolute(paths[i])) {
                if (internals.settings.input === paths[i]) {
                    retVal.input = Path.resolve(__dirname, internals.settings.input);
                }
                if (internals.settings.output === paths[i]) {
                    retVal.output = Path.resolve(__dirname, internals.settings.output);
                }
            }
            if (internals.settings.input === paths[i]) {
                retVal.input = internals.settings.input;
            }
            if (internals.settings.output === paths[i]) {
                retVal.output = internals.settings.output;
            }
        }
        const input = this._check(retVal.input);
        if (!input) {
            retVal.input = false;
        }
        const output = this._check(retVal.output);
        if (!output) {
            retVal.output = false;
        }
        return retVal;
    }

    _check(toCheck) {

        try {
            Fs.lstatSync(toCheck);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    toJson(options) {

        const replacer = internals.settings.replacer;
        const spacer = internals.settings.spacer;
        const sheets = this.sheets;
        const obj = {};
        for (let i = 0; i < sheets.length; ++i) {
            const name = sheets[i];
            const formatter = internals.settings.formatter[name] || internals.settings.formatter.standard;
            const sheet = this.data[name];
            const result = formatter(sheet);
            const jsonObj = JSON.stringify(result, replacer, spacer);
            obj[name] = jsonObj;
            if (options.write) {
                const fileName = Path.resolve(__dirname, this.output, name + '.json');
                Fs.writeFileSync(fileName, jsonObj);
            }
        }
        return obj;

    }

    streamBook() {

        const rs = Readable();
        const recs = this.data;
        const replacer = internals.settings.replacer;
        const spacer = internals.settings.spacer;

        rs._read = function () {

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
            throw new Error(sheet + ' is not a sheet in workbook');
        }
        const rs = Readable();
        const recs = this.data[sheet];
        const replacer = internals.settings.replacer;
        const spacer = internals.settings.spacer;

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
