'use strict'

//Importaciones..
var Project = require('../models/user');
var fs = require('fs');
var path = require('path');
const multer = require('multer');
const { Router } = require('express'); 
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

const router = new Router();

var controller = {
	
	


	home: function(req, res){
		return res.status(200).send({
			message: 'home'
		});
	},

	//Guardar usuario..
	saveUser: function(req, res){
		var project = new Project();

		var params = req.body;
		project.name = params.name;
        project.lastname = params.lastname;
        project.phone = params.phone;
        project.password = params.password;
        project.observation = params.observation;
        project.level = params.level;
		project.email = params.email;
		project.image = params.image;
		project.doc = params.doc;
		project.code = params.code;
		

		project.save((err, projectStored) => {
			if(err) return res.status(500).send({message: 'Error al guardar el usuario.'});

			if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el usuario.'});

			return res.status(200).send({project: projectStored});
		});
	},

	//Captura usuario..
	getUser: function(req, res){
		var projectId = req.params.id;

		if(projectId == null) return res.status(404).send({message: 'El usuario no existe.'});

		//Búsqueda en la base de datos..
		Project.findById(projectId, (err, project) => {

			if(err) return res.status(500).send({message: 'Error al devolver los datos.'});

			if(!project) return res.status(404).send({message: 'El usuario no existe.'});

			return res.status(200).send({
				project
			});

		});
	},

	//Captura usuarios..
	getUsers: function(req, res){

		//Enseña todos los datos usuarios en este project..
		Project.find({}).sort('-year').exec((err, projects) => {

			if(err) return res.status(500).send({message: 'Error al devolver los datos.'});

			if(!projects) return res.status(404).send({message: 'No hay usuarios que mostrar.'});

			return res.status(200).send({projects});
		});

	},

	//Actualiza información de usuarios..
	updateUser: function(req, res){
		var projectId = req.params.id;
		var update = req.body;
		var password = update.password;
		const getuser = Project.findById(projectId);
	

			const saltRounds = 10;
			bcrypt.genSalt(saltRounds, function(err, salt) {
				bcrypt.hash(update.password , salt, function(err, hash) {
					update.password = hash;
	
					console.log(update.password )
				Project.findByIdAndUpdate(projectId, update,{new:true}, (err, projectUpdated) => {
					if(err) return res.status(500).send({message: 'Error al actualizar'});
	
					if(!projectUpdated) return res.status(404).send({message: 'No existe el usuario para actualizar'});
	
					return res.status(200).send({
						project: projectUpdated
					});
				});
	
				});
			});

	

	},

	//Eliminar usuario..
	deleteUser: function(req, res){
		var projectId = req.params.id;
		
		var fileName = 'IMG'+'-'+projectId+'.jpeg';
		fs.unlink('uploads/'+fileName, (err) => {  
	   if(err) throw err;
	   console.log('File deleted: ' + fileName);

		Project.findByIdAndRemove(projectId, (err, projectRemoved) => {
		
			
			if(err) return res.status(500).send({message: 'No se ha podido borrar el usuario'});

			if(!projectRemoved) return res.status(404).send({message: "No se puede eliminar este usuario."});

			return res.status(200).send({
				project: projectRemoved
			});
		});
	
   });

	},

	//Subir imagen..
	uploadImage: function(req, res){
	
		var projectId = req.params.id;
		var fileName = 'Imagen no subida...';
		
	
			
			const storage = multer.diskStorage({
				destination: path.join(__dirname, '../uploads'),
				filename:  (req, file, cb) => {
				
					cb(null, 'IMG'+'-'+projectId+'.jpeg');
				}
			})
			
			const uploadI = multer({
				storage,
				limits: {fileSize: 1000000}
			}).single('image');
		
			if(uploadI){
		
				uploadI(req, res, (err) => {
				if (err) {
					err.message = 'The file is so heavy for my service';
						return res.send(err);
					}
				
					var fileName = 'IMG'+'-'+projectId+'.jpeg';
					//if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
				
						Project.findByIdAndUpdate(projectId, {image: fileName}, {new: true}, (err, projectUpdated) => {
							if(err) return res.status(500).send({message: 'La imagen no se ha subido'});
		
							if(!projectUpdated) return res.status(404).send({message: 'El usuario no existe y no se ha asignado la imagen'});
		
							return res.status(200).send({
								project: projectUpdated
							});
						});
					/*}else{
						fs.unlink(filePath, (err) => {
							return res.status(200).send({message: 'La extensión no es válida'});
						});
					}
					*/
					//console.log(req.file);
					//res.send('uploaded');
				});
				
	
			}else{
				return res.status(200).send({
					message: fileName
				});
			}
	
		},


	//Captura de imagen..
	getImageFile: function(req, res){
		var file = req.params.image;
		var path_file = './uploads/'+file;

		fs.exists(path_file, (exists) => {
			if(exists){
				return res.sendFile(path.resolve(path_file));
			}else{
				return res.status(200).send({
					message: "No existe la imagen..."
				});
			}
		});
	}

};

module.exports = controller;