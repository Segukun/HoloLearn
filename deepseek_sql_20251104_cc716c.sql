-- MySQL dump compatible with XAMPP
-- Modified for MySQL 5.7 compatibility (XAMPP)

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `idcategories` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`idcategories`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Programacion');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `idcourses` int NOT NULL AUTO_INCREMENT,
  `idinstructor` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `summary` varchar(100) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`idcourses`),
  UNIQUE KEY `title_UNIQUE` (`title`),
  KEY `idinstructor_idx` (`idinstructor`),
  CONSTRAINT `idinstructor` FOREIGN KEY (`idinstructor`) REFERENCES `user` (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,1,'Curso de Programacion orientada a objetos','Curso de programacion en lenguaje Python para aprender a crear  utilizar objetos','El curso cntiene diferentes modulos desde el constructor de clases  hasta clases geredadas');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `iduser` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `password_hash` varchar(200) NOT NULL,
  `category` enum('cursante','instructor') DEFAULT 'cursante',
  PRIMARY KEY (`iduser`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'juan@example.com','Juan Pérez','$2b$05$4KZgn/6YCjrr7woezFUBa.luPKVqeDnnQ35gU8RUpQph83bDOUmvy','cursante'),(2,'maria@example.com','María Gómez','$2b$05$vUBZwE5D.PwlE9zpSeDUZuiKzB/xEKITsTwgRoE.Bya.NFSnGNxc2','cursante'),(3,'ana@example.com','Ana Torres','$2b$05$BJjTvvK3p7DsGtNWD4bN8u1llskwiBc1fQJkZUzK8sltQJysh9hTa','cursante'),(7,'ejemplo@ejemplo.com','ejemplo','$2b$10$OQYEEy5Qb2bAbezaYIgSYuXgRzZu2xL1UcNwDo0kwIawBwuBYpbL2','cursante');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_categories`
--

DROP TABLE IF EXISTS `course_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_categories` (
  `idcourse_categories` int NOT NULL AUTO_INCREMENT,
  `idcourse` int NOT NULL,
  `idcategories` int NOT NULL,
  PRIMARY KEY (`idcourse_categories`),
  KEY `idcourses_idx` (`idcourse`),
  KEY `idcategory_idx` (`idcategories`),
  CONSTRAINT `idcategories` FOREIGN KEY (`idcategories`) REFERENCES `categories` (`idcategories`),
  CONSTRAINT `idcourses` FOREIGN KEY (`idcourse`) REFERENCES `courses` (`idcourses`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_categories`
--

LOCK TABLES `course_categories` WRITE;
/*!40000 ALTER TABLE `course_categories` DISABLE KEYS */;
INSERT INTO `course_categories` VALUES (1,1,1);
/*!40000 ALTER TABLE `course_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `idenrollments` int NOT NULL AUTO_INCREMENT,
  `iduser` int NOT NULL,
  `idcourses` int NOT NULL,
  `status` enum('active','completed','cancelled') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`idenrollments`),
  KEY `iduser_idx` (`iduser`),
  KEY `idcourses_idx` (`idcourses`),
  CONSTRAINT `idcourses_enrollment` FOREIGN KEY (`idcourses`) REFERENCES `courses` (`idcourses`),
  CONSTRAINT `iduser_enrollment` FOREIGN KEY (`iduser`) REFERENCES `user` (`iduser`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (1,1,1,'active');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `idlessons` int NOT NULL AUTO_INCREMENT,
  `idcourse` int NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `lessonorder` int NOT NULL DEFAULT '0',
  `content_type` enum('text','link') DEFAULT 'text',
  PRIMARY KEY (`idlessons`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES (1,1,'Constructor','Para que un objeto de una clase pueda ser creado, la misma debe tenr un constructor',1,'text');
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_progress`
--

DROP TABLE IF EXISTS `lesson_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_progress` (
  `idlesson_progress` int NOT NULL AUTO_INCREMENT,
  `idenrollments` int NOT NULL,
  `idlessons` int NOT NULL,
  `lesson_progresscol` enum('not_started','in_progress','completed') DEFAULT 'not_started',
  PRIMARY KEY (`idlesson_progress`),
  KEY `idenrollments_idx` (`idenrollments`),
  KEY `idlessons_idx` (`idlessons`),
  CONSTRAINT `idenrollments` FOREIGN KEY (`idenrollments`) REFERENCES `enrollments` (`idenrollments`),
  CONSTRAINT `idlessons` FOREIGN KEY (`idlessons`) REFERENCES `lessons` (`idlessons`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_progress`
--

LOCK TABLES `lesson_progress` WRITE;
/*!40000 ALTER TABLE `lesson_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `lesson_progress` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-04 12:12:58