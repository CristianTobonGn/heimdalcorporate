'use strict'

//Importaciones..
var Project = require('../models/email');
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


	//Función de guardar emails..
	saveEmail: function(req, res){
		var project = new Project();

		var params = req.body;
		project.name = params.name;
        project.asunto = params.asunto;
        project.email = params.email;
		project.message = params.message;
		

		project.save((err, projectStored) => {
			if(err) return res.status(500).send({message: 'Error al guardar el e-mail.'});

			if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el e-mail.'});

			return res.status(200).send({project: projectStored});
		});
	},

	//Captura email..
	getEmail: function(req, res){
		var projectId = req.params.id;

		if(projectId == null) return res.status(404).send({message: 'El e-mail no existe.'});

		//buscas en la base de datos el e-mail..
		Project.findById(projectId, (err, project) => {

			if(err) return res.status(500).send({message: 'Error al devolver los datos.'});

			if(!project) return res.status(404).send({message: 'El e-mail no existe.'});

			return res.status(200).send({
				project
			});

		});
	},

	//Captura todos los emails..
	getEmails: function(req, res){

		//saca todos los datos documentos en este caso project
		Project.find({}).sort('-year').exec((err, projects) => {

			if(err) return res.status(500).send({message: 'Error al devolver los datos.'});

			if(!projects) return res.status(404).send({message: 'No hay e-mails que mostrar.'});

			return res.status(200).send({projects});
		});

	},

	//Función eliminar e-mail..
	deleteEmail: function(req, res){
		var projectId = req.params.id;
		
	
		Project.findByIdAndRemove(projectId, (err, projectRemoved) => {
		
			
			if(err) return res.status(500).send({message: 'No se ha podido borrar el e-mail'});

			if(!projectRemoved) return res.status(404).send({message: "No se puede eliminar este e-mail."});

			return res.status(200).send({
				project: projectRemoved
			});
		});
	},



};

module.exports = controller;