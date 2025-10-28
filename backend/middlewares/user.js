const connection = require("../connection");
const { User } = require("../classes/classUser");
const { Course } = require("../classes/classCourse");
const { Lesson } = require("../classes/classLesson");

//! USUARIOS EN SINGULAR

//Traer un solo usuario por ID y adjuntarlo a req.user
function fetchUserById(req, res, next) {
  const userId = req.params.id;
  const sql = "SELECT * FROM user WHERE iduser = ?";
  connection.query(sql, [userId], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    req.user = new User(
      results[0].iduser,
      results[0].email,
      results[0].full_name,
      results[0].password_hash,
      results[0].category
    );
    next();
  });
}

//Añadirle los cursos a los que esta inscripto el usuario
function attachCoursesToUser(req, res, next) {
  const sql =
    "SELECT c.* FROM courses c INNER JOIN enrollments e ON c.idcourses = e.idcourses WHERE e.iduser = ?";

  connection.query(sql, [req.user.iduser], (err, results) => {
    if (err) {
      return res.status(400).send("Error fetching courses for user:", err);
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
    req.user.setCourses(courses);
    next();
  });
}

//Añadirle el progreso de clases al usuario
function attachLessonsToUser(req, res, next) {
    const sql = "SELECT * FROM lessons WHERE idcourse = ?";

    Promise.all(
        req.user.courses.map((course) => {
          return new Promise((resolve, reject) => {
            connection.query(sql, [course.idCourse], (err, results) => {
              if (err) {
                console.error("Error fetching lessons for courses:", err);
                return resolve(course); 
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
      ).then((updatedCourses) => {
        req.user.courses = updatedCourses;
        next();
      })
      .catch((err) => {
        console.error("Error attaching lessons to user:", err);
        next(err);
      });
}

//Responder con el usuario adjuntado a req.user
function respondWithUser(req, res) {
  if (!req.user) return res.status(500).send("No user available");
  return res.json(req.user);
}

module.exports = {
  fetchUserById,
  respondWithUser,
  attachCoursesToUser,
  attachLessonsToUser,
};
