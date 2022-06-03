'use strict'

//importa modulos
var express = require('express');
var bodyParser = require('body-parser');



var app = express();

// cargar archivos rutas
var project_routes = require('./routes/project');

// middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// rutas
app.use('/api', project_routes);
/*
app.get('/',(req, res)=>{
   
    res.status(200).send({
        "<h1>pagina de inicio</h1>"
    });
});
app.get('/test/:id',(req, res)=>{
    console.log(req.body.nombre);
    console.log(req.query.web);
    //si agraga parametro ala url
    console.log(req.params.id);
    res.status(200).send({
        "<h1>pagina de inicio</h1>"
    });
});

*/

// exportar
module.exports = app;

