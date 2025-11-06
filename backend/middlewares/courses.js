const connection = require("../connection");
const { Course } = require("../classes/classCourse");
const { Lesson } = require("../classes/classLesson");
const { User } = require("../classes/classUser");

// Middleware: traer usuarios de la base de datos y adjuntarlos a req.users
function fetchCourses(req, res, next) {
  connection.query("SELECT * FROM courses", (err, results) => {
    if (err) return next(err);
    req.courses = results.map(
      (c) =>
        new Course(
          c.idcourses,
          c.idinstructor,
          c.title,
          c.summary,
          c.description
        )
    );
    next();
  });
}

//Añadir lecciones a cada curso en req.courses
function attachLessonsToCourses(req, res, next) {
  const sql = "SELECT l.* FROM lessons l WHERE l.idcourse = ?";

  Promise.all(
    req.courses.map((course) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, [course.idCourse], (err, results) => {
          if (err) {
            console.error("Error fetching lessons for courses:", err);
            return resolve(course); // Resolver con el curso original si hay error
          }
          const lessons = results.map(
            (l) =>
              new Lesson(
                l.idlessons,
                l.idcourses,
                l.title,
                l.content,
                l.lesson_order,
                l.content_type
              )
          );
          course.setLessons(lessons);
          resolve(course);
        });
      });
    })
  )
    .then((updatedCourses) => {
      req.courses = updatedCourses;
      next();
    })
    .catch((err) => {
      console.error("Error attaching lessons to courses:", err);
      next(err);
    });
}

//Añadir estudiantes a cada curso en req.courses
function attachStudentsToCourses(req, res, next) {
  const sql =
    "SELECT u.* FROM user u INNER JOIN enrollments e ON u.iduser = e.iduser WHERE e.iduser = ?";

  Promise.all(
    req.courses.map((course) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, [course.idCourse], (err, results) => {
          if (err) {
            console.error("Error fetching students for courses:", err);
            return resolve(course); // Resolver con el curso original si hay error
          }
          const students = results.map(
            (s) => new User(s.iduser, s.email, s.full_name, s.category)
          );
          course.setStudents(students);
          resolve(course);
        });
      });
    })
  )
    .then((updatedCourses) => {
      req.courses = updatedCourses;
      next();
    })
    .catch((err) => {
      console.error("Error attaching users to courses:", err);
      next(err);
    });
}

//Lo mismo pero en singular
function fetchCourseById(req, res, next) {
  const courseId = req.params.id;
  const sql = "SELECT * FROM courses WHERE idcourses = ?";

  connection.query(sql, [courseId], (err, results) => {
    if (err) return next(err);

    req.course = new Course(
      results[0].idcourses,
      results[0].idinstructor,
      results[0].title,
      results[0].summary,
      results[0].description
    );
    next();
  });
}

function attachLessonsToCourseById(req, res, next) {
  const sql = "SELECT l.* FROM lessons l WHERE l.idcourse = ?";

  connection.query(sql, [req.course.idCourse], (err, results) => {
    if (err) return next(err);

    const lessons = results.map(
      (l) =>
        new Lesson(
          l.idlessons,
          l.idcourses,
          l.title,
          l.content,
          l.lesson_order,
          l.content_type
        )
    );
    req.course.setLessons(lessons);
    next();
  });
}

function attachStudentsToCourseById(req, res, next) {
  const sql =
    "SELECT u.* FROM user u INNER JOIN enrollments e ON u.iduser = e.iduser WHERE e.iduser = ?";

  connection.query(sql, [req.course.idCourse], (err, results) => {
    if (err) return next(err);

    const students = results.map(
      (s) => new User(s.iduser, s.email, s.full_name, s.category)
    );
    req.course.setStudents(students);
    next();
  });
}

// Responde con los cursos adjuntados a req
function respondWithCourses(req, res) {
  if (!req.courses) return res.status(500).send("No courses available");
  return res.json(req.courses);
}

function respondWithCourse(req, res) {
  if (!req.course) return res.status(404).send("No course found");
  return res.json(req.course);
}

module.exports = {
  fetchCourses,
  fetchCourseById,
  attachLessonsToCourses,
  attachStudentsToCourses,
  attachLessonsToCourseById,
  attachStudentsToCourseById,
  respondWithCourse,
  respondWithCourses,
};
