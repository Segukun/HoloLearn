const connection = require("../connection");
const { Lesson } = require("../classes/classLesson");

// Middleware: traer usuarios de la base de datos y adjuntarlos a req.users
function fetchLessons(req, res, next) {
  connection.query("SELECT * FROM lessons", (err, results) => {
    if (err) return next(err);
    req.lessons = results.map(
      (l) =>
        new Lesson(l.idlessons, l.idcourse, l.title, l.content, l.lesson_order, l.content_type)
    );
    next();
  });
}

// Responde con las clases adjuntados a req
function respondWithLessons(req, res) {
  if (!req.lessons) return res.status(500).send("No lessons available");
  return res.json(req.lessons);
}

module.exports = { fetchLessons, respondWithLessons };