'use strict'

//para trabajar con los modelos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//crear esquema
var ProjectSchema = Schema({
	name: String,
	description: String,
	category: String,
	year: Number,
	langs: String,
	image: String
});

module.exports = mongoose.model('Project', ProjectSchema);
// projects  --> guarda los documents en la coleccion