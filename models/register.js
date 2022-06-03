'use strict'

//para trabajar con los modelos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//crear esquema
var ProjectSchema = Schema({
	name: String,
    lastname: String,
    phone: String,
    observation: String,
    level: String,
    email: String,
    doc: String,
    code: String,
    date: Date,
    elemetType: String,
    tp: String
});

module.exports = mongoose.model('Register', ProjectSchema);
// projects  --> guarda los documents en la coleccion