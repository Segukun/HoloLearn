const connection = require("../connection");
const Math = require("mathjs");
const { User } = require("../classes/classUser");
const { Course } = require("../classes/classCourse");
const { Lesson } = require("../classes/classLesson");

//! USUARIOS EN SINGULAR

//Traer un solo usuario por ID y adjuntarlo a req.user
function fetchUserById(req, res, next) {
  const userId = req.session.userId;
  const sql = "SELECT * FROM user WHERE iduser = ?";
  connection.query(sql, [userId], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.status(404).send("User not found");
    }

    req.session.userData = new User(
      results[0].iduser,
      results[0].email,
      results[0].full_name,
      results[0].category,
      results[0].password_hash
    );
    next();
  });
}

//Añadirle los cursos a los que esta inscripto el usuario
function attachCoursesToUser(req, res, next) {
  const userId = req.session.userId;
  const sql =
    "SELECT c.* FROM courses c INNER JOIN enrollments e ON c.idcourses = e.idcourses WHERE e.iduser = ?";

  connection.query(sql, [userId], (err, results) => {
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

    req.session.userData.setCourses(courses);
    next();
  });
}

//Añadirle el progreso de clases al usuario
function attachLessonsToUser(req, res, next) {
  const sql = "SELECT * FROM lessons WHERE idcourse = ?";

  Promise.all(
    req.session.userData.courses.map((course) => {
      return new Promise((resolve, reject) => {
        connection.query(sql, [course.idCourse], (err, results) => {
          if (err) {
            console.error("Error fetching lessons for courses:", err);
            return resolve(course);
          }
          const lessons = results.map(
            (r) =>
              new Lesson(
                r.idlessons,
                r.idcourse,
                r.title,
                r.content,
                r.lesson_order,
                r.content_type
              )
          );
          course.setLessons(lessons);
          resolve(course);
        });
      });
    })
  )
    .then((updatedCourses) => {
      req.session.userData.courses = updatedCourses;
      next();
    })
    .catch((err) => {
      console.error("Error attaching lessons to user:", err);
      next(err);
    });
}

function respondWithUserProgress(req, res) {
  const queries = (req.session.userData.courses || []).map((course) => {
    const totalLessons = Array.isArray(course.lessons)
      ? course.lessons.length
      : 0;
    const sql =
      "SELECT COUNT(*) AS completed FROM lesson_progress lp JOIN enrollments e ON lp.idenrollments = e.idenrollments JOIN lessons l ON lp.idlessons = l.idlessons WHERE e.iduser = ? AND l.idcourse = ? AND lp.lesson_progresscol = 'completed';";

    return new Promise((resolve) => {
      if (totalLessons === 0) {
        course.progress = 0;
        return resolve(course);
      }

      connection.query(
        sql,
        [req.session.userId, course.idCourse],
        (err, results) => {
          if (err) {
            console.error("Error fetching lessons progress for courses:", err);
            course.progress = 0;
            return resolve(course);
          }

          const completedLessons =
            (results && results[0] && results[0].completed) || 0;
          const progress = Math.floor((completedLessons / totalLessons) * 100);
          course.progress = progress;
          resolve(course);
        }
      );
    });
  });

  Promise.all(queries)
    .then((updatedCourses) => {
      req.session.userData.courses = updatedCourses;
      const coursesProgress = updatedCourses.map((c) => ({
        idCourse: c.idCourse,
        title: c.title,
        progress: c.progress || 0,
      }));

      res.json({
        userId: req.session.userId,
        courses: coursesProgress,
      });
    })
    .catch((err) => {
      console.error("Error attaching lessons progress to user:", err);
      res.status(500).send("Error fetching user progress");
    });
}

//Responder con el usuario adjuntado a req.user
function respondWithUser(req, res) {
  if (!req.session.userData) return res.status(500).send("No user available");
  return res.json(req.session.userData);
}

module.exports = {
  fetchUserById,
  respondWithUser,
  respondWithUserProgress,
  attachCoursesToUser,
  attachLessonsToUser,
};
