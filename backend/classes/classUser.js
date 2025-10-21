class User {
  constructor(iduser, email, full_name, password_hash, category, courses = []) {
    this.iduser = iduser;
    this.email = email;
    this.full_name = full_name;
    this.password_hash = password_hash;
    this.category = category;
    this.courses = courses; // Cursos en los que el usuario está inscrito. Guardar objetos curso.
  }

  setCourses(courses) {
    this.courses = courses;
  }
}

module.exports = { User };
