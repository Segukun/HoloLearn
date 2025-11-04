const bcryptjs = require("bcryptjs");
const connection = require("../connection");
// Este archivo va a ser para verificar y manejar la cuenta del usuario, login, logout, crear cuenta, eliminar cuenta, etc
//!Archivo mas importante
//Ejemplo de login:
function login(req, res, next) {
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

    req.session.userId = results[0].iduser;
    req.session.email = results[0].email;
    req.session.isAuthenticated = true;

    res.json({
      success: true, //creo que esto reemplaza al session.isAuthenticated de arriba. Pero prefiero de la otra forma.
      message: "Login successful",
      user: {
        id: results[0].iduser,
        email: results[0].email,
      },
    });
  });
}

//Logout
function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Error logging out",
      });
    }

    res.clearCookie("connect.sid"); // borra la cookie
    res.json({
      message: "Logout successful",
    });
  });
}

function requireAuth(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ 
      error: "Not authenticated. Please log in." 
    });
  }
  next();
}

//Create user
function createUser(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  const passwordHash = bcryptjs.hashSync(password, 10);
  const sql =
    "INSERT INTO user (full_name, email, password_hash) VALUES (?, ?, ?)";

  connection.query(sql, [name, email, passwordHash], (err, results) => {
    if (err) {
      return res.status(500).send("Error creating user");
    }
    res.status(201).json({
      mensaje: "User created successfully",
      alumno: { name, email, password },
    });
  });
}

// TODO: Agregar funciones para eliminar cuenta, actualizar datos, etc. Suscribirse a cursos, completar clases, etc.

module.exports = {
  login,
  createUser,
  logout,
  requireAuth,
};
