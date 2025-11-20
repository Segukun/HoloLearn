-- DeepSeek: dump for XAMPP / MySQL 5.7
-- Generated for import into XAMPP (utf8mb4, InnoDB)
-- WARNING: This will create and populate the database `hololearn2`. Change the name if needed.

DROP DATABASE IF EXISTS `hololearn2`;
CREATE DATABASE `hololearn2` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hololearn2`;

-- Temporarily disable foreign key checks for bulk import
SET FOREIGN_KEY_CHECKS = 0;

-- TABLE: categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `idcategories` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`idcategories`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `categories` (`idcategories`,`name`) VALUES
  (1,'Programacion'),
  (2,'Bases de Datos'),
  (3,'Frontend'),
  (4,'DevOps'),
  (5,'Data Science');

-- TABLE: user
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `iduser` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `password_hash` varchar(200) NOT NULL,
  `category` enum('cursante','instructor') DEFAULT 'cursante',
  PRIMARY KEY (`iduser`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Users: example dataset (password_hash are placeholders)
INSERT INTO `user` (`iduser`,`email`,`full_name`,`password_hash`,`category`) VALUES
  (1,'juan@example.com','Juan Pérez','$2b$10$examplehashjuan','cursante'),
  (2,'maria@example.com','María Gómez','$2b$10$examplehashmaria','cursante'),
  (3,'ana@example.com','Ana Torres','$2b$10$examplehashana','instructor'),
  (4,'luis@example.com','Luis Martínez','$2b$10$examplehashluis','cursante'),
  (5,'sofia@example.com','Sofía Ruiz','$2b$10$examplehashsofia','cursante'),
  (6,'carlos@example.com','Carlos Díaz','$2b$10$examplehashcarlos','instructor'),
  (7,'instructor1@example.com','Instructor Uno','$2b$10$examplehashi1','instructor'),
  (8,'instructor2@example.com','Instructor Dos','$2b$10$examplehashi2','instructor');

-- TABLE: courses
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `idcourses` int NOT NULL AUTO_INCREMENT,
  `idinstructor` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`idcourses`),
  UNIQUE KEY `title_UNIQUE` (`title`),
  KEY `idinstructor_idx` (`idinstructor`),
  CONSTRAINT `fk_courses_instructor` FOREIGN KEY (`idinstructor`) REFERENCES `user` (`iduser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `courses` (`idcourses`,`idinstructor`,`title`,`summary`,`description`) VALUES
  (1,3,'POO en Python','Curso POO - básico a intermedio','Aprende clases, objetos, herencia y patrones.'),
  (2,6,'Introducción a SQL','SQL y consultas básicas','SELECT, JOIN, agregaciones, subconsultas y prácticas.'),
  (3,7,'Fundamentos de Frontend','HTML, CSS y accesibilidad','Estructura semántica, Box Model y responsive.'),
  (4,8,'Docker y DevOps básico','Contenedores y despliegue','Introducción a Docker, imágenes y despliegue.'),
  (5,3,'Python para Data Science','Numpy, Pandas y visualización','Análisis de datos con Python y prácticas.'),
  (6,6,'Modelado de Bases de Datos','Diseño de BD relacionales','Normalización, ERD y claves foráneas.'),
  (7,7,'JavaScript Moderno','ES6+, asincronía y DOM','Funciones, promesas, async/await y manipulación DOM.'),
  (8,8,'Machine Learning 101','Conceptos ML','Regresión, clasificación y pipeline básico.');

-- TABLE: course_categories
DROP TABLE IF EXISTS `course_categories`;
CREATE TABLE `course_categories` (
  `idcourse_categories` int NOT NULL AUTO_INCREMENT,
  `idcourse` int NOT NULL,
  `idcategories` int NOT NULL,
  PRIMARY KEY (`idcourse_categories`),
  KEY `idcourses_idx` (`idcourse`),
  KEY `idcategory_idx` (`idcategories`),
  CONSTRAINT `fk_cc_categories` FOREIGN KEY (`idcategories`) REFERENCES `categories` (`idcategories`),
  CONSTRAINT `fk_cc_courses` FOREIGN KEY (`idcourse`) REFERENCES `courses` (`idcourses`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO `course_categories` (`idcourse_categories`,`idcourse`,`idcategories`) VALUES
  (1,1,1),
  (2,2,2),
  (3,3,3),
  (4,4,4),
  (5,5,5),
  (6,6,2),
  (7,7,1),
  (8,8,5);

-- TABLE: lessons
DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `idlessons` int NOT NULL AUTO_INCREMENT,
  `idcourse` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `lessonorder` int NOT NULL DEFAULT '0',
  `content_type` enum('text','link') DEFAULT 'text',
  PRIMARY KEY (`idlessons`),
  KEY `idcourse_idx` (`idcourse`),
  CONSTRAINT `fk_lessons_course` FOREIGN KEY (`idcourse`) REFERENCES `courses` (`idcourses`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert multiple lessons per course
INSERT INTO `lessons` (`idlessons`,`idcourse`,`title`,`content`,`lessonorder`,`content_type`) VALUES
  -- Course 1: POO en Python (3 lessons)
  (1,1,'Clases y objetos','Definición de clases y creación de objetos.',1,'text'),
  (2,1,'Constructores y atributos','Uso de __init__ y atributos de instancia.',2,'text'),
  (3,1,'Herencia y polimorfismo','Herencia simple, múltiples y polimorfismo.',3,'text'),

  -- Course 2: SQL (4 lessons)
  (4,2,'SELECT y filtros','SELECT, WHERE y operadores.',1,'text'),
  (5,2,'JOINs básicos','INNER JOIN, LEFT JOIN y ejemplos.',2,'text'),
  (6,2,'Agregaciones','COUNT, SUM, GROUP BY, HAVING.',3,'text'),
  (7,2,'Subconsultas y vistas','Subconsultas correlacionadas y vistas.',4,'text'),

  -- Course 3: Frontend (3 lessons)
  (8,3,'Estructura HTML','Etiquetas semánticas principales.',1,'text'),
  (9,3,'Box Model','margin, padding, border y tamaños.',2,'text'),
  (10,3,'Flexbox básico','Contenedores flex y alineación.',3,'text'),

  -- Course 4: Docker (3 lessons)
  (11,4,'Introducción a Docker','Qué es Docker y casos de uso.',1,'text'),
  (12,4,'Imágenes y contenedores','Construcción de imágenes y comando docker run.',2,'text'),
  (13,4,'Docker Compose','Definir servicios con docker-compose.',3,'text'),

  -- Course 5: Python DS (3 lessons)
  (14,5,'Numpy básico','Arrays y operaciones vectorizadas.',1,'text'),
  (15,5,'Pandas Introducción','Series y DataFrames.',2,'text'),
  (16,5,'Visualización','Matplotlib y seaborn (conceptos).',3,'text'),

  -- Course 6: Modelado BD (3 lessons)
  (17,6,'Entidades y relaciones','Modelo ER y cardinalidades.',1,'text'),
  (18,6,'Normalización','1NF,2NF,3NF y ejemplos.',2,'text'),
  (19,6,'Índices y performance','Tipos de índices y su uso.',3,'text'),

  -- Course 7: JS (3 lessons)
  (20,7,'Sintaxis ES6+','let/const, arrow functions, templates.',1,'text'),
  (21,7,'Promesas y async','Promesas, callbacks y async/await.',2,'text'),
  (22,7,'DOM y eventos','Manipulación y escucha de eventos.',3,'text'),

  -- Course 8: ML (3 lessons)
  (23,8,'Introducción a ML','Conceptos y tipos de problemas.',1,'text'),
  (24,8,'Regresión','Regresión lineal y métricas.',2,'text'),
  (25,8,'Clasificación','KNN, árboles y evaluación.',3,'text');

-- TABLE: enrollments
DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE `enrollments` (
  `idenrollments` int NOT NULL AUTO_INCREMENT,
  `iduser` int NOT NULL,
  `idcourses` int NOT NULL,
  `status` enum('active','completed','cancelled') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`idenrollments`),
  KEY `iduser_idx` (`iduser`),
  KEY `idcourses_idx` (`idcourses`),
  CONSTRAINT `fk_enroll_user` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`),
  CONSTRAINT `fk_enroll_course` FOREIGN KEY (`idcourses`) REFERENCES `courses` (`idcourses`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Example enrollments (mix of students and instructors as enrollee where makes sense)
INSERT INTO `enrollments` (`idenrollments`,`iduser`,`idcourses`,`status`) VALUES
  (1,1,1,'active'),  -- Juan in POO
  (2,1,2,'active'),  -- Juan in SQL
  (3,2,2,'active'),  -- María in SQL
  (4,2,3,'active'),  -- María in Frontend
  (5,4,1,'active'),  -- Luis in POO
  (6,5,5,'active'),  -- Sofía in Python DS
  (7,1,7,'active'),  -- Juan in JS
  (8,3,6,'active'),  -- Ana (instructor) enrolled in Modelado BD for testing
  (9,6,4,'active'),  -- Carlos in Docker
  (10,7,8,'active'); -- Instructor Uno in ML for testing

-- TABLE: lesson_progress
DROP TABLE IF EXISTS `lesson_progress`;
CREATE TABLE `lesson_progress` (
  `idlesson_progress` int NOT NULL AUTO_INCREMENT,
  `idenrollments` int NOT NULL,
  `idlessons` int NOT NULL,
  `lesson_progresscol` enum('not_started','in_progress','completed') DEFAULT 'not_started',
  PRIMARY KEY (`idlesson_progress`),
  KEY `idenrollments_idx` (`idenrollments`),
  KEY `idlessons_idx` (`idlessons`),
  CONSTRAINT `fk_lp_enroll` FOREIGN KEY (`idenrollments`) REFERENCES `enrollments` (`idenrollments`),
  CONSTRAINT `fk_lp_lessons` FOREIGN KEY (`idlessons`) REFERENCES `lessons` (`idlessons`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Example progress rows (varied statuses)
INSERT INTO `lesson_progress` (`idlesson_progress`,`idenrollments`,`idlessons`,`lesson_progresscol`) VALUES
  (1,1,1,'completed'),
  (2,1,2,'in_progress'),
  (3,2,4,'completed'),
  (4,2,5,'completed'),
  (5,3,4,'completed'),
  (6,3,5,'in_progress'),
  (7,4,8,'completed'),
  (8,5,1,'in_progress'),
  (9,6,14,'completed'),
  (10,6,15,'in_progress'),
  (11,7,20,'completed'),
  (12,8,17,'not_started'),
  (13,9,11,'completed'),
  (14,10,23,'in_progress');

-- OPTIONAL: add more synthetic progress entries to create volume
INSERT INTO `lesson_progress` (`idenrollments`,`idlessons`,`lesson_progresscol`) VALUES
  (1,3,'not_started'),
  (2,6,'not_started'),
  (3,7,'not_started'),
  (4,9,'in_progress'),
  (5,2,'completed'),
  (6,16,'completed'),
  (7,21,'in_progress'),
  (8,18,'in_progress'),
  (9,12,'completed'),
  (10,24,'not_started');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Set appropriate AUTO_INCREMENT values (so next insert continues correctly)
ALTER TABLE `categories` AUTO_INCREMENT = 6;
ALTER TABLE `user` AUTO_INCREMENT = 9;
ALTER TABLE `courses` AUTO_INCREMENT = 9;
ALTER TABLE `course_categories` AUTO_INCREMENT = 9;
ALTER TABLE `lessons` AUTO_INCREMENT = 26;
ALTER TABLE `enrollments` AUTO_INCREMENT = 11;
ALTER TABLE `lesson_progress` AUTO_INCREMENT = 26;

-- Quick verification selects (optional; safe to run)
-- SELECT COUNT(*) AS total_users FROM `user`;
-- SELECT idcourses, title FROM `courses`;
-- SELECT COUNT(*) AS total_lessons FROM `lessons`;
-- SELECT COUNT(*) AS total_enrollments FROM `enrollments`;
-- SELECT COUNT(*) AS total_progress FROM `lesson_progress`;

-- End of dump

