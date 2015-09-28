// Load modules

var Path = require('path');
var Fs = require('fs');
var Readable = require('stream').Readable;
var Hoek = require('hoek');
var Joi = require('joi');
var IsAbsolute = require('path-is-absolute');
var Parse = require('j');


var internals = {
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



module.exports = internals.XlJson = function (options) {

    Hoek.assert(this.constructor === internals.XlJson, 'XlJson must be constructed using new');
    Hoek.assert(typeof options === 'object', 'XlJson must be constructed with an options object');
    internals.settings = Hoek.applyToDefaults(internals.defaults, options);
    Joi.assert(this.settings, internals.Schema, 'Invalid options passed to construct XlsJson');
    var paths = this._normalize();
    if (!paths.input || !paths.output) {
        throw new Error('One of ' + internals.settings.input + ' or ' + internals.settings.output + ' are not valid directories to read and write from');
    }
    this.input = paths.input;
    this.output = paths.output;
    var p = Parse.readFile(this.input);
    this.data = Parse.utils.to_json(p);
    this.sheets = Object.keys(this.data);
    return this;

};


internals.XlJson.prototype._normalize = function (dir) {

    var paths = [internals.settings.input, internals.settings.output];
    var retVal = {};
    for (var i = 0, il = paths.length; i < il; ++i) {

        if (!IsAbsolute(paths[i])) {
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
    var input = this._check(retVal.input);
    if (!input) {
        retVal.input = false;
    }
    var output = this._check(retVal.output);
    if (!output) {
        retVal.output = false;
    }
    return retVal;
};

internals.XlJson.prototype._check = function (toCheck) {

    try {
        Fs.lstatSync(toCheck);
        return true;
    } catch (e) {
        return false;
    }

};


internals.XlJson.prototype.toJson = function (options) {

    var replacer = internals.settings.replacer;
    var spacer = internals.settings.spacer;
    var sheets = this.sheets;
    var obj = {};
    for (var i = 0; i < sheets.length; i++) {
        var name = sheets[i];
        var formatter = internals.settings.formatter[name] || internals.settings.formatter.standard;
        var sheet = this.data[name];
        var result = formatter(sheet);
        var jsonObj = JSON.stringify(result, replacer, spacer);
        obj[name] = jsonObj;
        if (options.write) {
            var fileName = Path.resolve(__dirname, this.output, name + '.json');
            Fs.writeFileSync(fileName, jsonObj);
        }
    }
    return obj;

};


internals.XlJson.prototype.streamBook = function () {

    var rs = Readable();
    var recs = this.data;
    var replacer = internals.settings.replacer;
    var spacer = internals.settings.spacer;

    rs._read = function () {

        var keys = Object.keys(recs);
        for (var a = 0, al = keys.length; a < al; ++a) {
            var sheet = recs[keys[a]];
            for (var i = 0, il = sheet.length; i < il; ++i) {
                var data = sheet[i];
                rs.push(JSON.stringify(data, replacer, spacer) + '\n');
            }
        }
        rs.push(null);
    };

    return rs;

};


internals.XlJson.prototype.streamSheet = function (sheet) {

    if (this.sheets.indexOf(sheet) < 0) {
        throw new Error(sheet + ' is not a sheet in workbook');
    }
    var rs = Readable();
    var recs = this.data[sheet];
    var replacer = internals.settings.replacer;
    var spacer = internals.settings.spacer;

    rs._read = function () {

        for (var i = 0, il = recs.length; i < il; i++) {
            var data = recs[i];
            rs.push(JSON.stringify(data, replacer, spacer) + '\n');
        }
        rs.push(null);
    };

    return rs;

};
