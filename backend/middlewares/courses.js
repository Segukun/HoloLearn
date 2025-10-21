const connection = require("../connection");
const { Course } = require("../classes/classCourse");

// Middleware: traer usuarios de la base de datos y adjuntarlos a req.users
function fetchCoursesMiddleware(req, res, next) {
  connection.query("SELECT * FROM courses", (err, results) => {
    if (err) return next(err);
    req.courses = results.map(
      (c) =>
        new Course(c.idcourses, c.idinstructor, c.title, c.summary, c.description)
    );
    next();
  });
}

// Responde con los cursos adjuntados a req
function respondWithCourses(req, res) {
  if (!req.courses) return res.status(500).send("No courses available");
  return res.json(req.courses);
}

module.exports = { fetchCoursesMiddleware, respondWithCourses };
