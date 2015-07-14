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
    this.settings = Hoek.applyToDefaults(internals.defaults, options);
    Joi.assert(this.settings, internals.Schema, 'Invalid options passed to construct XlsJson');
    this.exists();
    var p = Parse.readFile(this.settings.input);
    this.data = Parse.utils.to_json(p);
    this.sheets = Object.keys(this.data);
    return this;

};


internals.XlJson.prototype.exists = function (dir) {

    var arr = [this.settings.input, this.settings.output];
    for (var i = 0; i < arr.length; i++) {

        if (this.settings.input === arr[i]) {
            if (!IsAbsolute(arr[i])) {
                this.settings.input = Path.resolve(__dirname, this.settings.input);
            }
            this.check(this.settings.input);
        } else {
            if (!IsAbsolute(arr[i])) {
                this.settings.output = Path.resolve(__dirname, this.settings.output);
            }
            this.check(this.settings.output);
        }
    }
};

internals.XlJson.prototype.check = function (toCheck) {

    var exists = Fs.existsSync(toCheck);
    if (!exists) {
        throw new Error('Directory or file ' + toCheck + ' does not exist');
    }

};


internals.XlJson.prototype.writeFiles = function () {

    var replacer = this.settings.replacer;
    var spacer = this.settings.spacer;
    var sheets = this.sheets;
    for (var i = 0; i < sheets.length; i++) {
        var name = sheets[i];
        var formatter = this.settings.formatter[name] || this.settings.formatter.standard;
        var sheet = this.data[name];
        var result = formatter(sheet);
        var jsonObj = JSON.stringify(result, replacer, spacer);
        var fileName = Path.resolve(__dirname, this.settings.output, name + '.json');
        Fs.writeFileSync(fileName, jsonObj);
    }

};


internals.XlJson.prototype.streamBook = function () {

    var rs = Readable();
    var recs = this.data;

    rs._read = function () {

        var keys = Object.keys(recs);
        for (var a = 0, al = keys.length; a < al; ++a) {
            var sheet = recs[keys[a]];
            for (var i = 0, il = sheet.length; i < il; ++i) {
                rs.push(JSON.stringify(sheet[i]) + '\n');
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

    rs._read = function () {

        for (var i = 0, il = recs.length; i < il; i++) {
            rs.push(JSON.stringify(recs[i]) + '\n');
        }
        rs.push(null);
    };

    return rs;

};
