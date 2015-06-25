// Load modules

var Path = require('path');
var Fs = require('fs');
var Readable = require('stream').Readable;

var Hoek = require('hoek');
var Joi = require('joi');
var IsAbsolute = require('path-is-absolute');
var Parse = require('j');

var parser = function (obj) {

    return obj;
};

var internals = {
    defaults: {
        formatter: parser
    },
    Schema: {
        input: Joi.string().required(),
        output: Joi.string().required(),
        formatter: Joi.func().required(),
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



internals.XlJson.prototype.writeFile = function () {


    var rawObj = this.data;
    var formatter = this.settings.formatter;
    var replacer = this.settings.replacer;
    var spacer = this.settings.spacer;
    var sheets = Object.keys(rawObj);
    for (var i = 0; i < sheets.length; i++) {
        var name = sheets[i];
        var sheet = rawObj[name];
        var result = formatter(sheet);
        var jsonObj = JSON.stringify(result, replacer, spacer);
        var fileName = Path.resolve(__dirname, this.settings.output, name + '.json');
        Fs.writeFileSync(fileName, jsonObj);
    }

};


internals.XlJson.prototype.cursor = function (sheet) {

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
