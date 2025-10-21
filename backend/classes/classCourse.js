class Course {
  constructor(idCourse, idInstructor, title, summary, description) {
    this.idCourse = idCourse;
    this.idInstructor = idInstructor;
    this.title = title;
    this.summary = summary;
    this.description = description;
  }
}

module.exports = { Course };