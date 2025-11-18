const app = require("./app");
const connection = require("./connection");

// ! LO MAS NECESARIO ES EL MANEJO DE LA DE LA CUENTA

const {
  fetchUsers,
  respondWithUsers,
  attachCoursesToUsers,
  attachLessonsToUsers,
} = require("./middlewares/users");
const {
  fetchCourses,
  fetchCourseById,
  //attachLessonsToCourses,
  //attachStudentsToCourses,
  attachLessonsToCourseById,
  attachStudentsToCourseById,
  fetchCoursesByCategory,
  respondWithCourse,
  respondWithCourses,
} = require("./middlewares/courses");
const { fetchLessons, respondWithLessons } = require("./middlewares/lessons");
const {
  fetchCategories,
  respondWithCategories,
} = require("./middlewares/categories");
const {
  login,
  createUser,
  logout,
  requireAuth,
  changePassword,
  changeEmail,
  changeName,
  deleteUser,
} = require("./middlewares/account");
const {
  fetchUserById,
  respondWithUser,
  respondWithUserProgress,
  unsuscribeFromCourse,
  subscribeToCourse,
  completeLesson,
  attachCoursesToUser,
  attachLessonsToUser,
} = require("./middlewares/user");

// # TABLAS: categories, courses, course_categories, enrollments, lesson_progress, lessons, users

//-- -- -- -- -- -- -- -- -- --
// ! Tabla users

// Obtener usuarios y responder, son muchos datos, crear metodos que solo usen algunos y de solo un usuario, no de todos, este seria mas para un admin
app.get(
  "/users",
  fetchUsers,
  attachCoursesToUsers,
  attachLessonsToUsers,
  respondWithUsers
);

// Ejemplo de uso de middleware en otra ruta con un manejador personalizado
app.get("/users/summary", fetchUsers, (req, res) => {
  const summary = req.users.map((u) => ({
    id: u.iduser,
    email: u.email,
    full_name: u.full_name,
  }));
  res.json(summary);
});

//Obtener un solo usuario por ID
app.get(
  "/user/profile",
  requireAuth,
  fetchUserById,
  attachCoursesToUser,
  attachLessonsToUser,
  respondWithUser
);

//-- -- -- -- -- -- -- -- -- --
// ! Tabla enrollments --> Intermedia de users y courses con status

//obtener inscripciones y responder

app.get(
  "/user/progress",
  requireAuth,
  fetchUserById,
  attachCoursesToUser,
  attachLessonsToUser,
  respondWithUserProgress
);

//Suscribirse a un curso
app.post("/user/subscribe/:courseId", requireAuth, subscribeToCourse);

//Desuscribirse de un curso
app.delete("/user/unsubscribe/:courseId", requireAuth, unsuscribeFromCourse);

//Completar una clase
app.post(
  "/user/complete-lesson/:courseId/:lessonId",
  requireAuth,
  completeLesson
);

//-- -- -- -- -- -- -- -- -- --
// ! Tabla courses

// Obtener cursos y responder
app.get("/courses", fetchCourses, respondWithCourses);

app.get(
  "/course/:id",
  fetchCourseById,
  attachLessonsToCourseById,
  attachStudentsToCourseById,
  respondWithCourse
);

//-- -- -- -- -- -- -- -- -- --
// ! Tabla categories

//obtener categorias y responder
app.get("/categories", fetchCategories, respondWithCategories);

//-- -- -- -- -- -- -- -- -- --
// ! Tabla course_categories --> Intermedia de courses y categories
//Obtener cursos por categoria
app.get(
  "/courses/category/:categoryId",
  fetchCoursesByCategory,
  respondWithCourses
);

//-- -- -- -- -- -- -- -- -- --
// ! Tabla lessons

//Obtener clases y responder
app.get("/lessons", fetchLessons, respondWithLessons);

//-- -- -- -- -- -- -- -- -- --
// ! Tabla lesson_progress --> Intermedia de clase e inscripciones con status(lesson_progress)

// ! Manejar la cuenta del usuario: login, logout, crear cuenta, eliminar cuenta, etc. Tambien usa la tabla de users

//Verify authentication
app.get("/user/auth/check", requireAuth, (req, res) => {
  res.json({
    isAuthenticated: !!req.session.isAuthenticated,
    user: req.session.email || null,
    message: "Authenticated",
    userId: req.session.userId,
  });
});

//Login:
app.post("/user/login", login);

//Create user
app.post("/user/create", createUser);

//Logout
app.post("/user/logout", requireAuth, logout);

//Cambiar contraseña
app.put("/user/change/pass", requireAuth, changePassword);

//Cambiar email
app.put("/user/change/email", requireAuth, changeEmail);

//Cambiar nombre
app.put("/user/change/name", requireAuth, changeName);

//Eliminar usuario
app.delete("/user/delete", requireAuth, deleteUser, logout);
 