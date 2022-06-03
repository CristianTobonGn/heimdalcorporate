'use strict'

//Importaciones..
var Project = require('../models/register');
var fs = require('fs');
var path = require('path');
const multer = require('multer');
const { Router } = require('express'); 


const router = new Router();

var controller = {
	
	


	home: function(req, res){
		return res.status(200).send({
			message: 'home'
		});
	},

	//Función de guardar registros..
	saveRegister: function(req, res){
		var project = new Project();

		var params = req.body;
		project.name = params.name;
        project.lastname = params.lastname;
        project.phone = params.phone;
        project.observation = params.observation;
        project.level = params.level;
		project.email = params.email;
		project.doc = params.doc;
		project.code = params.code;
        project.date = params.date;
        project.elementType = params.elementType;
        project.tp = params.tp;


		project.save((err, projectStored) => {
			if(err) return res.status(500).send({message: 'Error al guardar el registro.'});

			if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el registro.'});

			return res.status(200).send({project: projectStored});
		});
	},

	//Captura el registro..
	getRegister: function(req, res){
		var projectId = req.params.id;

		if(projectId == null) return res.status(404).send({message: 'El registro no existe.'});

		//Búsqueda en la base de datos..
		Project.findById(projectId, (err, project) => {

			if(err) return res.status(500).send({message: 'Error al devolver los datos.'});

			if(!project) return res.status(404).send({message: 'El registro no existe.'});

			return res.status(200).send({
				project
			});

		});
	},

	//Capturar registros..
	getRegisters: function(req, res){

		//Sacar todos los datos registros en este caso project..
		Project.find({}).sort('-year').exec((err, projects) => {

			if(err) return res.status(500).send({message: 'Error al devolver los datos.'});

			if(!projects) return res.status(404).send({message: 'No hay registros que mostrar.'});

			return res.status(200).send({projects});
		});

	},

	updateRegister: function(req, res){
		var projectId = req.params.id;
		var update = req.body;

		Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdated) => {
			if(err) return res.status(500).send({message: 'Error al actualizar'});

			if(!projectUpdated) return res.status(404).send({message: 'No existe el registro para actualizar'});

			return res.status(200).send({
				project: projectUpdated
			});
		});

	},

	//Eliminar registros..
	deleteRegister: function(req, res){
		var projectId = req.params.id;
		
		var fileName = 'IMG'+'-'+projectId+'.jpeg';
		fs.unlink('uploads/'+fileName, (err) => {  
	   if(err) throw err;
	   console.log('File deleted: ' + fileName);

		Project.findByIdAndRemove(projectId, (err, projectRemoved) => {
		
			
			if(err) return res.status(500).send({message: 'No se ha podido borrar el registros'});

			if(!projectRemoved) return res.status(404).send({message: "No se puede eliminar este registro."});

			return res.status(200).send({
				project: projectRemoved
			});
		});
	
   });

	},

	
};

module.exports = controller;