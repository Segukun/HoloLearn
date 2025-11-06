class Lesson{
    constructor(idlessons, idcourse, title, content, lesson_order, content_type, completed = false){
        this.idlessons = idlessons;
        this.idcourse = idcourse;
        this.title = title;
        this.content = content;
        this.lesson_order = lesson_order;
        this.content_type = content_type;
        this.completed = completed;
    }

    setCompleted(completed) {
    this.completed = completed;
  }
}

module.exports = {Lesson};