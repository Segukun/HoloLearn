class User {
  constructor(iduser, email, full_name, password_hash, category, courses = [], progress = {}) {
    this.iduser = iduser;
    this.email = email;
    this.full_name = full_name;
    this.password_hash = password_hash;
    this.category = category;
    this.courses = courses; // Cursos en los que el usuario está inscrito
    this.progress = progress; // Progreso del usuario en cada curso
  }

  setCourses(courses) {
    this.courses = courses;
  }

  setProgress(progress) {
    this.progress = progress;
  }
}

module.exports = { User };
