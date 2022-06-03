'use strict'

//para trabajar con los modelos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//crear esquema
var ProjectSchema = Schema({
	name: String,
    asunto: String,
    email: String,
    message: String,
},
{
  timestamps: true,
  versionKey: false,
}
);



module.exports = mongoose.model('Email', ProjectSchema);
// projects  --> guarda los documents en la coleccion



