const bcryptjs = require("bcryptjs");
// Este archivo va a ser para verificar y manejar la cuenta del usuario, login, logout, crear cuenta, eliminar cuenta, etc
//Ejemplo de login:
// app.post("/login", (req, res) => {
//   const { nombre, contraseña } = req.body;

//   const sql = "SELECT * FROM alumnos WHERE nombre = ?";

//   connection.query(sql, [nombre], (err, results) => {
//     console.log("Datos:", req.body);
//     console.log("Resultados", results);
//     if (err) {
//       return res.status(500).send("Error en la consulta");
//     }
//     if (results.length === 0) {
//       return res.status(404).send("Usuario no encontrado");
//     }
    
//     let autenticado = bcryptjs.compareSync(contraseña, results[0].contraseña);
//     if (!autenticado) {
//       return res.status(401).send("Contraseña incorrecta");
//     }
//     res.json(results);
//   });
// });