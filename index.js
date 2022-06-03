'use strict'

//importar mongoose
const express = require('express');

require('dotenv').config();
var app = require('./app');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Base de datos
dbConnection();

// Directorio Público
app.use( express.static('public') );



// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});






