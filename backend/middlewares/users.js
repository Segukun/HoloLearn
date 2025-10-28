const connection = require("../connection");
const { User } = require("../classes/classUser");
const { Course } = require("../classes/classCourse");
const { Lesson } = require("../classes/classLesson");

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
  const sql =
    "SELECT c.* FROM courses c INNER JOIN enrollments e ON c.idcourses = e.idcourses WHERE e.iduser = ?";

  Promise.all(
    req.users.map((user) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, [user.iduser], (err, results) => {
          if (err) {
            console.error("Error fetching courses for users:", err);
            return resolve(user); // Continue with user even if error
          }
          const courses = results.map(
            (r) =>
              new Course(
                r.idcourses,
                r.idinstructor,
                r.title,
                r.summary,
                r.description
              )
          );
          user.setCourses(courses);
          resolve(user);
        });
      });
    })
  )
    .then((updatedUsers) => {
      req.users = updatedUsers;
      //console.log("All users after attaching courses:", req.users);
      next();
    })
    .catch((err) => {
      console.error("Error attaching courses to users:", err);
      next(err);
    });
}

//Añadir el progreso para cada usuario
function attachLessonsToUsers(req, res, next) {
  const sql = "SELECT * FROM lessons WHERE idcourse = ?";

  Promise.all(
    req.users.map((user) => {
      // Para cada usuario, procesamos sus cursos
      return Promise.all(
        user.courses.map((course) => {
          return new Promise((resolve, reject) => {
            connection.query(sql, [course.idCourse], (err, results) => {
              if (err) {
                console.error("Error fetching lessons for courses:", err);
                return resolve(course); // Continue with course even if error
              }
              const lessons = results.map((r) => new Lesson(
                r.idlessons,
                r.idcourse,
                r.title,
                r.content,
                r.lesson_order,
                r.content_type
              ));

              console.log(results);
              course.setLessons(lessons);
              resolve(course);
            });
          });
        })
      ).then(() => user); 
    })
  )
    .then((updatedUsers) => {
      req.users = updatedUsers;
      //console.log("All users after attaching lessons:", req.users);
      next();
    })
    .catch((err) => {
      console.error("Error attaching lessons to users:", err);
      next(err);
    });
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
  attachLessonsToUsers,
};
