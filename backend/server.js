const app = require("./app");
const connection = require("./connection");

const {
  fetchUsersMiddleware,
  respondWithUsers,
  attachCoursesToUsers,
  attachLessonsToUsers,
} = require("./middlewares/users");
const {
  fetchCoursesMiddleware,
  respondWithCourses,
} = require("./middlewares/courses");
const {
  fetchLessonsMiddleware,
  respondWithLessons,
} = require("./middlewares/lessons");
const { loginMiddleware } = require("./middlewares/account");

// # TABLAS: categories, courses, course_categories, enrollments, lesson_progress, lessons, users

//-- -- -- -- -- -- -- -- -- --
// ! Tabla users

// Obtener usuarios y responder, son muchos datos, crear metodos que solo usen algunos y de solo un usuario, no de todos, este seria mas para un admin
app.get(
  "/user",
  fetchUsersMiddleware,
  attachCoursesToUsers,
  attachLessonsToUsers,
  respondWithUsers
);

// Ejemplo de uso de middleware en otra ruta con un manejador personalizado
app.get("/user/summary", fetchUsersMiddleware, (req, res) => {
  const summary = req.users.map((u) => ({
    id: u.iduser,
    email: u.email,
    full_name: u.full_name,
  }));
  res.json(summary);
});

//-- -- -- -- -- -- -- -- -- --
// ! Tabla enrollments --> Intermedia de users y courses con status

//obtener inscripciones y responder

//TODO: Obtener el progreso del curso para cada usuario

//-- -- -- -- -- -- -- -- -- --
// ! Tabla courses

// Obtener cursos y responder
app.get("/courses", fetchCoursesMiddleware, respondWithCourses);

//TODO: Obtener el profesor y los cursantes de cada curso

//-- -- -- -- -- -- -- -- -- --
// ! Tabla categories

//obtener categorias y responder

//-- -- -- -- -- -- -- -- -- --
// ! Tabla course_categories --> Intermedia de courses y categories

//-- -- -- -- -- -- -- -- -- --
// ! Tabla lessons

//Obtener clases y responder
app.get("/lessons", fetchLessonsMiddleware, respondWithLessons);

//TODO: Obtener el progreso de la clase para cada usuario

//-- -- -- -- -- -- -- -- -- --
// ! Tabla lesson_progress --> Intermedia de clase e inscripciones con status(lesson_progress)

// ! Manejar la cuenta del usuario: login, logout, crear cuenta, eliminar cuenta, etc. Tambien usa la tabla de users
//Ejemplo de login:
app.post("/login", loginMiddleware, (req, res) => {});
