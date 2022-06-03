'use strict'
//Importaciones
//var express = require('express');
var ProjectController = require('../controllers/project');
var UserController = require('../controllers/user');
var RegisterController = require('../controllers/register');
var EmailController = require('../controllers/email');
//cargar express rutas
//var router = express.Router();
const User = require('../models/user');

//trae el multiparte para definir los tipos de archivos
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });


const { Router } = require('express'); 

const router = new Router();

const path = require('path');
const multer = require('multer');
const fs = require('fs');

// RENDER FORM UPLOAD
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

//Routers
router.get('/', (req, res) => {
    res.send('hello')
});


router.post('/signin', async (req, res) => {
    const { email, code, password } = req.body;
  
    const user = await User.findOne({email});
    const validPassword = await bcrypt.compare(password, user.password);
      
    if (!user) return res.status(401).send('The email doen\' exists');
    if (user.code !== code) return res.status(401).send('Wrong code');
    if (!validPassword) return res.status(401).send('Wrong Password');

		const token = jwt.sign({_id: user._id}, 'secretkey');

    return res.status(200).json({token});
});


//router.get('/private-tasks', verifyToken, (req, res) => {

router.post('/images/upload',ProjectController.uploadImage);

router.get('/home', ProjectController.home);
router.post('/test', ProjectController.test);
router.post('/save-project', ProjectController.saveProject);
router.get('/project/:id?', ProjectController.getProject);
router.get('/projects', ProjectController.getProjects);
router.put('/project/:id', ProjectController.updateProject);
router.delete('/project/:id', ProjectController.deleteProject);
//router.post('/upload-image/:id',  ProjectController.uploadImage);
//router.get('/get-image/:image', ProjectController.getImageFile);
router.post('/save-user', verifyToken, UserController.saveUser);
router.get('/user/:id?', verifyToken, UserController.getUser);
router.get('/users', verifyToken, UserController.getUsers);
router.put('/user/:id', verifyToken, UserController.updateUser);
router.delete('/user/:id', verifyToken, UserController.deleteUser);
router.post('/upload-image/:id', UserController.uploadImage);
router.get('/get-image/:image', UserController.getImageFile);
router.post('/save-register', verifyToken, RegisterController.saveRegister);
router.get('/register/:id?', verifyToken, RegisterController.getRegister);
router.get('/registers', verifyToken, RegisterController.getRegisters);
router.put('/register/:id', verifyToken, RegisterController.updateRegister);
router.delete('/register/:id', verifyToken, RegisterController.deleteRegister);
router.post('/save-email', EmailController.saveEmail);
router.get('/email/:id?',verifyToken, EmailController.getEmail);
router.get('/emails',verifyToken, EmailController.getEmails);
router.delete('/email/:id',verifyToken, EmailController.deleteEmail);

//Verificación de token..
async function verifyToken(req, res, next) {
	try {
		if (!req.headers.authorization) {
			return res.status(401).send('Unauhtorized Request');
		}
		let token = req.headers.authorization.split(' ')[1];
		if (token === 'null') {
			return res.status(401).send('Unauhtorized Request');
		}

		const payload = await jwt.verify(token, 'secretkey');
		if (!payload) {
			return res.status(401).send('Unauhtorized Request');
		}
		req.userId = payload._id;
		next();
	} catch(e) {
		//console.log(e)
		return res.status(401).send('Unauhtorized Request');
	}
}

module.exports = router;