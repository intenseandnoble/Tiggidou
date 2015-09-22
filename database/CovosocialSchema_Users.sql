CREATE DATABASE  IF NOT EXISTS `CovosocialSchema` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `CovosocialSchema`;
-- MySQL dump 10.13  Distrib 5.5.44, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: CovosocialSchema
-- ------------------------------------------------------
-- Server version	5.5.44-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `idUser` int(11) NOT NULL,
  `familyName` varchar(45) NOT NULL,
  `firstName` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `age` int(10) unsigned DEFAULT NULL,
  `avatar` varchar(45) DEFAULT NULL,
  `comment` longtext,
  `anecdote` longtext,
  `member` tinyint(1) DEFAULT '0',
  `phoneNumber` int(11) DEFAULT NULL,
  `password` varchar(60) DEFAULT NULL,
  `favoriteMusic` int(11) DEFAULT NULL,
  `education` int(11) DEFAULT NULL,
  `communicationChoice` int(11) DEFAULT NULL,
  `driverLicence` varchar(40) DEFAULT NULL,
  `idPassenger` int(11) DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `_idx` (`favoriteMusic`),
  KEY `fk2_idx` (`communicationChoice`),
  KEY `fk3_idx` (`education`),
  KEY `fk4_idx` (`driverLicence`),
  KEY `fk5_idx` (`idPassenger`),
  CONSTRAINT `fk_users_1` FOREIGN KEY (`favoriteMusic`) REFERENCES `MusicStyles` (`musicId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_2` FOREIGN KEY (`communicationChoice`) REFERENCES `CommunicationOptions` (`idCommunicationOptions`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_3` FOREIGN KEY (`education`) REFERENCES `Educations` (`idEducations`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_4` FOREIGN KEY (`driverLicence`) REFERENCES `Drivers` (`driverLiscence`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_5` FOREIGN KEY (`idPassenger`) REFERENCES `Passengers` (`idPassengers`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-09-22 18:45:00
