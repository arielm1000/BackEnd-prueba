// Rutas para el sistema
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const usuarioController = require("../controllers/usuarioController");

//Defino la ruta principal
router.get('/', (req, res) => {
    res.send('Hola Mundoooo');
});

router.post('/guardaruser/',
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'Paswword minimo 6 caracteres').isLength({min: 6}),
        check('role', 'El Rol es Obligatorio').notEmpty()
    ], 
    usuarioController.crearUsuarios
);

router.post('/auth',
    [
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'Paswword minimo 6 caracteres').isLength({min: 6}),
    ], 
    usuarioController.autenticarUsuario
);

module.exports = router ;