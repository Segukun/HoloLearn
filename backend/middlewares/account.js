const bcryptjs = require("bcryptjs");
const connection = require("../connection");
// Este archivo va a ser para verificar y manejar la cuenta del usuario, login, logout, crear cuenta, eliminar cuenta, etc

//Ejemplo de login:
function loginMiddleware(req, res, next) {
  const { email, password } = req.body;
  const sql = "SELECT * FROM user WHERE email = ?";

  connection.query(sql, [email], (err, results) => {
    console.log("Datos:", req.body);
    console.log("Resultados", results);
    if (err) {
      return res.status(500).send("Error in the query");
    }
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    let autenticado = bcryptjs.compareSync(password, results[0].password_hash);
    if (!autenticado) {
      return res.status(401).send("Incorrect password");
    }
    res.json(results);
  });
}

module.exports = {
  loginMiddleware,
};