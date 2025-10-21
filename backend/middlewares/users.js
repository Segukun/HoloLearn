const connection = require("../connection");
const { User } = require("../classes/classUser");

// Middleware: traer usuarios de la base de datos y adjuntarlos a req.users
function fetchUsersMiddleware(req, res, next) {
  connection.query("SELECT * FROM user", (err, results) => {
    if (err) return next(err);
    req.users = results.map(
      (u) =>
        new User(u.iduser, u.email, u.full_name, u.password_hash, u.category)
    );
    next();
  });
}

//Añadir los cursos a los que esta inscripto cada usuario
function attachCoursesToUsers(req, _, next) {
  // Implementar la lógica para adjuntar los cursos a los que está inscrito cada usuario, usar la tabla enrollments

  const sql = "SELECT idcourses FROM enrollments WHERE iduser = ?";

  Promise.all(
    req.users.map((user) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, [user.iduser], (err, results) => {
          if (err) {
            console.error("Error fetching courses for user:", err);
            return resolve(user); // Continue with user even if error
          }
          const courses = results.map((r) => r.idcourses);
          user.setCourses(courses);
          resolve(user);
        });
      });
    })
  )
    .then((updatedUsers) => {
      req.users = updatedUsers;
      console.log("All users after attaching courses:", req.users);
      next();
    })
    .catch((err) => {
      console.error("Error attaching courses to users:", err);
      next(err);
    });
}

//Añadir el progreso para cada usuario
function attachProgressToUsers(req, res, next) {
  //TODO: Implementar la lógica para adjuntar el progreso de cada usuario en el curso, traer cuantas lecciones ha completado y scar el porcentaje

  next();
}

// Responde con los usuarios adjuntados a req
function respondWithUsers(req, res) {
  if (!req.users) return res.status(500).send("No users available");
  return res.json(req.users);
}

module.exports = {
  fetchUsersMiddleware,
  respondWithUsers,
  attachCoursesToUsers,
  attachProgressToUsers,
};
