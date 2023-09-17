const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
var admin = require("firebase-admin");

//firebase
// Fetch the service account key JSON file contents
var serviceAccount = require("../prueba-fb95e-firebase-adminsdk-355gd-0422cb6c43.json");
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // The database URL depends on the location of the database
  databaseURL: "https://prueba-fb95e-default-rtdb.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();


exports.crearUsuarios = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    } 
    const { nombre, email, password, role } = req.body;
  
    try {
      //let usuario = await Usuario.findOne({ email });
      const user = db.ref("usuarios");
      var usuario = [];
      await user.orderByChild("email").equalTo(email).once("value",  (snapshot) => {
        usuario = snapshot.val();
      });
      //console.log(usuario, "bus usuario 2")
      if (usuario != undefined) {
        return res.status(400).json({ msg: "El email ya esta registrado" });
      }
      //has password
      const salt = await bcryptjs.genSalt(10);
      req.body.password = await bcryptjs.hash(password, salt);
      var newUser = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      }
      //gurdar usuario
      db.ref('usuarios').push(newUser)  
      return res.json({ msg: "Usuario Creado Correctamente." });

    } catch (error) {
      console.log("error");
      res.status(400).send("Hubo un error");
    }
  };
  
  exports.autenticarUsuario = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }  
    const { email, password } = req.body;
  
    try {
      //let usuario = await Usuario.findOne({ email } , { _id: 1, nombre: 1, rol: 1, password: 1 });
      const user = db.ref("usuarios");
      var usuario = [];
      await user.orderByChild("email").equalTo(email).once("value",  (snapshot) => {
        usuario = snapshot.val();
      });
      
      if (usuario == undefined) {
        return res.status(400).json({ msg: "El usuario no existe" });
      }

      const passCorrecto = await bcryptjs.compare(password, usuario[Object.keys(usuario)].password);
      if (!passCorrecto) {
        return res.status(400).json({ msg: "Usuario o Password incorrecto" });
      }
  
      //crear y firmar jwt
      const payload = {
        usuario: {
          id: usuario.id,
        },
      };
      //solo envio datos del user
      //usuario.password ="";
      usuario[Object.keys(usuario)].password="";
      jwt.sign(
        payload,
        process.env.SECRET,
        {
          expiresIn: 360000, //100 hora
        },
        (error, token) => {
          if (error) throw error;
          res.json({ token, usuario });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send("Hubo un error");
    }
  };
  