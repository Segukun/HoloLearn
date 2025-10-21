class Course {
  constructor(idCourse, idInstructor, title, summary, description, lessons = []) {
    this.idCourse = idCourse;
    this.idInstructor = idInstructor;
    this.title = title;
    this.summary = summary;
    this.description = description;
    this.lessons = lessons; // Lecciones que pertenecen al curso. Guardar objetos lección.
  }

  setLessons(lessons) {
    this.lessons = lessons;
  }
}

module.exports = { Course };