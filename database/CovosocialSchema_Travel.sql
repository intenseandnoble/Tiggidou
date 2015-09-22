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
-- Table structure for table `Travel`
--

DROP TABLE IF EXISTS `Travel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Travel` (
  `idAddTravel` int(11) NOT NULL,
  `startAddress` int(11) DEFAULT NULL,
  `destinationAddress` int(11) DEFAULT NULL,
  `driver` int(11) DEFAULT NULL,
  `travelTimes` int(11) DEFAULT NULL,
  `comments` longtext,
  `availableSeat` int(11) DEFAULT NULL,
  `takenSeat` int(11) DEFAULT NULL,
  `departureTime` datetime DEFAULT NULL,
  `luggagesSize` int(11) DEFAULT NULL,
  `petsAllowed` tinyint(4) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  PRIMARY KEY (`idAddTravel`),
  KEY `fk1_idx` (`luggagesSize`),
  KEY `fk_AddTravel_2_idx` (`startAddress`),
  KEY `fk_AddTravel_3_idx` (`destinationAddress`),
  KEY `fk_AddTravel_4_idx` (`driver`),
  CONSTRAINT `fk_AddTravel_1` FOREIGN KEY (`luggagesSize`) REFERENCES `Luggages` (`idLuggages`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_AddTravel_2` FOREIGN KEY (`startAddress`) REFERENCES `Address` (`idAddress`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_AddTravel_3` FOREIGN KEY (`destinationAddress`) REFERENCES `Address` (`idAddress`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_AddTravel_4` FOREIGN KEY (`driver`) REFERENCES `Users` (`idUser`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Travel`
--

LOCK TABLES `Travel` WRITE;
/*!40000 ALTER TABLE `Travel` DISABLE KEYS */;
/*!40000 ALTER TABLE `Travel` ENABLE KEYS */;
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
