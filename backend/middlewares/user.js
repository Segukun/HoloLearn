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
    const totalLessons = course.lessons.length;
    const sql =
      "SELECT COUNT(*) AS completed FROM lesson_progress lp JOIN enrollments e ON lp.idenrollments = e.idenrollments JOIN lessons l ON lp.idlessons = l.idlessons WHERE e.iduser = ? AND l.idcourse = ? AND lp.lesson_progresscol = 'completed';";

    return new Promise((resolve) => {
      if (totalLessons === 0) {
        course.setProgress(0);
        return resolve(course);
      }

      connection.query(
        sql,
        [req.session.userId, course.idCourse],
        (err, results) => {
          if (err) {
            console.error("Error fetching lessons progress for courses:", err);
            course.setProgress(0);
            return resolve(course);
          }
          console.log(
            "Course: ",
            course.idCourse,
            "Lesson progress results:",
            results
          );
          const completedLessons =
            (results && results[0] && results[0].completed) || 0;
          const progress = Math.floor((completedLessons / totalLessons) * 100);
          course.setProgress(progress);
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

// Suscribirse a un curso
function subscribeToCourse(req, res, next) {
  const userId = req.session.userId;
  const { courseId } = req.params;

  // Fijarse si el usuario esta inscripto en el curso
  const checkSql =
    "SELECT * FROM enrollments WHERE iduser = ? AND idcourses = ?";
  connection.query(checkSql, [userId, courseId], (err, results) => {
    if (err) {
      return res.status(500).send("Error checking enrollment status");
    }
    if (results.length > 0) {
      return res
        .status(409)
        .json({ message: "Already enrolled in this course" });
    }

    // Ver si el curso existe. esto podria ir antes para descartarlo mas facil.
    const courseSql = "SELECT idcourses FROM courses WHERE idcourses = ?";
    connection.query(courseSql, [courseId], (err, courseResults) => {
      if (err) {
        return res.status(500).send("Error checking course");
      }
      if (courseResults.length === 0) {
        return res.status(404).send("Course not found");
      }

      // Insertar inscripcion
      const insertSql =
        "INSERT INTO enrollments (iduser, idcourses, status) VALUES (?, ?, 'active')";
      connection.query(insertSql, [userId, courseId], (err) => {
        if (err) {
          console.error("Error subscribing to course:", err);
          return res.status(500).send("Error subscribing to course");
        }
        res.status(201).json({ message: "Successfully subscribed to course" });
      });
    });
  });
}

function unsuscribeFromCourse(req, res, next) {
  const userId = req.session.userId;
  const { courseId } = req.params;

  // Fijarse si el usuario esta inscripto en el curso
  const checkSql =
    "SELECT * FROM enrollments WHERE iduser = ? AND idcourses = ?";
  connection.query(checkSql, [userId, courseId], (err, results) => {
    if (err) {
      return res.status(500).send("Error checking enrollment status");
    }
    if (results.length > 0) {
      //borrar las lesson progress con este idenrollment antes para no hacer cossas raras con las foreign keys
      const deleteProgressSql =
        "DELETE FROM lesson_progress WHERE idenrollments = ?";
      connection.query(deleteProgressSql, [results[0].idenrollments], (err) => {
        if (err) {
          console.error("Error deleting lesson progress:", err);
          return res.status(500).send("Error unsubscribing from course");
        }
      });

      const deleteSql =
        "DELETE FROM enrollments WHERE iduser = ? AND idcourses = ?";
      connection.query(deleteSql, [userId, courseId], (err) => {
        if (err) {
          console.error("Error unsubscribing from course:", err);
          return res.status(500).send("Error unsubscribing from course");
        }
      });
      res
        .status(200)
        .json({ message: "Successfully unsubscribed from course" });
    }
  });
}

// Completar una clase. Verificar que exista.
function completeLesson(req, res, next) {
  const userId = req.session.userId;
  const { courseId, lessonId } = req.params;

  if (!courseId || !lessonId) {
    return res.status(400).send("Missing courseId or lessonId");
  }

  // Paso 1 Ver si el usuario esta inscripto
  const getEnrollmentSql =
    "SELECT idenrollments FROM enrollments WHERE iduser = ? AND idcourses = ?";
  connection.query(getEnrollmentSql, [userId, courseId], (err, results) => {
    if (err) {
      console.error("Error finding enrollment:", err);
      return res.status(500).send("Error finding enrollment");
    }
    if (!results || results.length === 0) {
      return res.status(404).send("Not enrolled in this course");
    }

    const enrollmentId = results[0].idenrollments;

    // Paso 2 Verificar que la clase corresponde al curso
    const lessonCheckSql =
      "SELECT idlessons FROM lessons WHERE idlessons = ? AND idcourse = ?";
    connection.query(
      lessonCheckSql,
      [lessonId, courseId],
      (err, lessonResults) => {
        if (err) {
          console.error("Error checking lesson:", err);
          return res.status(500).send("Error validating lesson");
        }
        if (!lessonResults || lessonResults.length === 0) {
          return res.status(404).send("Lesson not found in this course");
        }

        // Paso 3 Ver si ya esta completado
        const checkSql =
          "SELECT lesson_progresscol FROM lesson_progress WHERE idenrollments = ? AND idlessons = ?";
        connection.query(
          checkSql,
          [enrollmentId, lessonId],
          (err, checkResults) => {
            if (err) {
              console.error("Error checking lesson progress:", err);
              return res.status(500).send("Error checking lesson progress");
            }

            if (
              checkResults &&
              checkResults.length > 0 &&
              checkResults[0].lesson_progresscol === "completed"
            ) {
              return res.status(200).json({
                message: "Lesson already completed",
              });
            }

            // Paso 4 Marcar como completado
            const insertSql =
              "INSERT INTO lesson_progress (idenrollments, idlessons, lesson_progresscol) VALUES (?, ?, 'completed') ON DUPLICATE KEY UPDATE lesson_progresscol = 'completed'";
            connection.query(insertSql, [enrollmentId, lessonId], (err) => {
              if (err) {
                console.error("Error marking lesson complete:", err);
                return res.status(500).send("Error marking lesson complete");
              }
              res.status(200).json({
                message: "Lesson marked as completed",
              });
            });
          }
        );
      }
    );
  });
}

//Responder con el usuario adjuntado a req.session.userData
function respondWithUser(req, res) {
  if (!req.session.userData) return res.status(500).send("No user available");
  return res.json(req.session.userData);
}

module.exports = {
  fetchUserById,
  respondWithUser,
  respondWithUserProgress,
  unsuscribeFromCourse,
  subscribeToCourse,
  completeLesson,
  attachCoursesToUser,
  attachLessonsToUser,
};
