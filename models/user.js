'use strict'

//para trabajar con los modelos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

//crear esquema
var ProjectSchema = Schema({
	name: String,
    lastname: String,
    phone: String,
    password: String,
    observation: String,
    level: String,
    email: String,
    image: String,
    doc: String,
    code: String
},
{
  timestamps: true,
  versionKey: false,
}
);

ProjectSchema.pre('save', function(next){
    bcrypt.genSalt(10).then(salts => {
        bcrypt.hash(this.password, salts).then(hash => {
            this.password = hash;
            next();
        }).catch(error => next(error));
    }).catch(error => next(error));
});




module.exports = mongoose.model('User', ProjectSchema);
// projects  --> guarda los documents en la coleccion



