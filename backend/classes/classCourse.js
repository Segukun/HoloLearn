class Course {
  constructor(idCourse, idInstructor, title, summary, description, lessons = [], students = []) {
    this.idCourse = idCourse;
    this.idInstructor = idInstructor;
    this.title = title;
    this.summary = summary;
    this.description = description;
    this.lessons = lessons; // Lecciones que pertenecen al curso. Guardar objetos lección.
    this.students = students; // Estudiantes inscritos en el curso. Guardar objetos usuario.
    this.progress = 0; 
  }

  setLessons(lessons) {
    this.lessons = lessons;
  }
  setStudents(students) {
    this.students = students;
  }
  setProgress(progress) {
    this.progress = progress;
  }
}

module.exports = { Course };