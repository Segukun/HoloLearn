const bcryptjs = require("bcryptjs");
const connection = require("../connection");
// Este archivo va a ser para verificar y manejar la cuenta del usuario, login, logout, crear cuenta, eliminar cuenta, etc
//!Archivo mas importante

//Login:
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
    //Comparar la contraseña que mando el usuario con el hash que vino desde la db
    let autenticado = bcryptjs.compareSync(password, results[0].password_hash);
    if (!autenticado) {
      return res.status(401).send("Incorrect password");
    }

    // asignar a la sesion los datos del usuario y un booleano que indica que esta authenticado.
    req.session.userId = results[0].iduser;
    req.session.email = results[0].email;
    req.session.isAuthenticated = true;

    res.json({
      success: true, // creo que esto puede reemplazar al session.isAuthenticated de arriba. Pero prefiero de la otra forma.
      message: "Login successful",
      user: {
        id: results[0].iduser,
        email: results[0].email,
      },
    });
  });
}

// Logout
function logout(req, res, next) {
  // destruir la sesion
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: "Error logging out",
      });
    }

    res.clearCookie("connect.sid"); // borra la cookie, no se si es necesario, funcionaba sin esto la ultima vez.
    res.json({
      message: "Logout successful",
    });
  });
}

// funcion para pedir que el usuario este autenticado
function requireAuth(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.status(401).json({
      error: "Not authenticated. Please log in.",
    });
  }
  next();
}

// crear usuario
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

//Cambiar contraseña.
function changePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body;
  const userId = req.session.userId;

  const sql = "SELECT password_hash FROM user WHERE iduser = ?";
  const updateSql = "UPDATE user SET password_hash = ? WHERE iduser = ?";

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).send("Error in the query");
    }
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    let autenticado = bcryptjs.compareSync(
      currentPassword,
      results[0].password_hash
    );
    if (!autenticado) {
      return res.status(401).send("Incorrect current password");
    }

    //actualizar la contraseña como tal
    const newPasswordHash = bcryptjs.hashSync(newPassword, 10);

    connection.query(
      updateSql,
      [newPasswordHash, userId],
      (err, updateResults) => {
        if (err) {
          return res.status(500).send("Error updating password");
        }
        res.json({ message: "Password updated successfully" });
      }
    );
  });
}

//Cambiar email.
function changeEmail(req, res, next) {
  const { currentEmail, newEmail } = req.body;
  const userId = req.session.userId;

  const sql = "SELECT email FROM user WHERE iduser = ?";
  const updateSql = "UPDATE user SET email = ? WHERE iduser = ?";

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).send("Error in the query");
    }
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    if (!results[0].email === currentEmail) {
      return res.status(401).send("Incorrect current email");
    }

    connection.query(updateSql, [newEmail, userId], (err, updateResults) => {
      if (err) {
        return res.status(500).send("Error updating email: " + err);
      }
      res.json({ message: "Email updated successfully" });
    });
  });
}

//Cambiar nombre.
function changeName(req, res, next) {
  const { currentName, newName } = req.body;
  const userId = req.session.userId;

  const sql = "SELECT full_name FROM user WHERE iduser = ?";
  const updateSql = "UPDATE user SET full_name = ? WHERE iduser = ?";

  connection.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).send("Error in the query");
    }
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    if (!results[0].full_name === currentName) {
      return res.status(401).send("Incorrect current name");
    }

    connection.query(updateSql, [newName, userId], (err, updateResults) => {
      if (err) {
        return res.status(500).send("Error updating name");
      }
      res.json({ message: "Name updated successfully" });
    });
  });
}

//Eliminar usuario.
function deleteUser(req, res, next) {
  const userId = req.session.userId;
  
  const sqlEnrollmentId =
    "SELECT idenrollments FROM enrollments WHERE iduser = ?";
    
  connection.query(sqlEnrollmentId, [userId], (err, enrollmentResults) => {
    if (err) {
      return res.status(500).send("Error fetching enrollment id");
    }
    
    // Si no hay enrollments, ir directo a borrar el usuario
    if (enrollmentResults.length === 0) {
      const sqlUser = "DELETE FROM user WHERE iduser = ?";
      connection.query(sqlUser, [userId], (err, results) => {
        if (err) {
          return res.status(500).send("Error deleting user");
        }
        next();
      });
      return;
    }
    
    const sqlProgress = "DELETE FROM lesson_progress WHERE idenrollments = ?";
    
    Promise.all(
      enrollmentResults.map((enrollment) => {
        return new Promise((resolve, reject) => {
          connection.query(
            sqlProgress,
            [enrollment.idenrollments],
            (err, results) => {
              if (err) {
                return reject(err);
              }
              resolve();
            }
          );
        });
      })
    )
      .then(() => {
        const sqlEnrollment = "DELETE FROM enrollments WHERE iduser = ?";
        connection.query(sqlEnrollment, [userId], (err, results) => {
          if (err) {
            return res.status(500).send("Error deleting enrollments");
          }
          
          const sqlUser = "DELETE FROM user WHERE iduser = ?";
          connection.query(sqlUser, [userId], (err, results) => {
            if (err) {
              return res.status(500).send("Error deleting user");
            }
            
            // NO destruir sesión ni enviar respuesta aca, pasar al siguiente middleware (logout)
            next();
          });
        });
      })
      .catch((err) => {
        return res.status(500).send("Error deleting lesson progress: " + err);
      });
  });
}

module.exports = {
  login,
  createUser,
  logout,
  requireAuth,
  changePassword,
  changeEmail,
  changeName,
  deleteUser,
};
