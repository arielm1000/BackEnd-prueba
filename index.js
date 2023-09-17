const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');

//Crear el servidor
const app = express();

//Numerode puerto de la app
const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(bodyParser.json());

const formData = require('express-form-data');
app.use(formData.parse())

// Rutas
app.use('/api', require('./routes/rutas'));

//iniciar la app
app.listen(PORT, () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
});