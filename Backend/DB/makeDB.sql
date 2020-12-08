-- sudo mysql -u root -p < makeDB.sql
-- DROP DATABASE IF EXISTS CDCP_DB; 

CREATE DATABASE IF NOT EXISTS CDCP_DB;
USE CDCP_DB;

CREATE TABLE IF NOT EXISTS Users (id VARCHAR(36) PRIMARY KEY, nickname VARCHAR(25), email VARCHAR(50), password VARCHAR(255), registrationDate DATETIME);

CREATE TABLE IF NOT EXISTS Projects (id VARCHAR(36) PRIMARY KEY, title VARCHAR(50), inputType VARCHAR(20));

CREATE TABLE IF NOT EXISTS Examples (id VARCHAR(36) PRIMARY KEY, projectId VARCHAR(36), inputType VARCHAR(20), inputValue VARCHAR(100), 
                            FOREIGN KEY (projectId) REFERENCES Projects(id) ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS TagNames (projectId VARCHAR(36), exampleId VARCHAR(36), tagName VARCHAR(36),
                            FOREIGN KEY (projectId) REFERENCES Projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
                            FOREIGN KEY (exampleId) REFERENCES Examples(id) ON DELETE CASCADE ON UPDATE CASCADE,
                            PRIMARY KEY (projectId, exampleId, tagName));

CREATE TABLE IF NOT EXISTS TagValues (projectId VARCHAR(36), exampleId VARCHAR(36), tagName VARCHAR(36), tagValue VARCHAR(100), 
                            FOREIGN KEY (projectId, exampleId, tagName) REFERENCES TagNames(projectId, exampleId, tagName) ON DELETE CASCADE ON UPDATE CASCADE,
                            PRIMARY KEY (projectId, exampleId, tagName, tagValue));


-- Nei Logs e Token non uso la ON DELETE CASCADE/ON UPDATE CASCADE, perchè sono interessato a tenere traccia di tutte le modifiche!
CREATE TABLE IF NOT EXISTS Logs (id VARCHAR(36) PRIMARY KEY, userId VARCHAR(36), projectId VARCHAR(36), exampleId VARCHAR(36), actionType VARCHAR(50), details VARCHAR(255), timeStamp DATETIME, 
                            FOREIGN KEY (userId) REFERENCES Users(id), 
                            FOREIGN KEY (exampleId) REFERENCES Examples(id), 
                            FOREIGN KEY (projectId) REFERENCES Projects(id));

CREATE TABLE IF NOT EXISTS TokenAuth (id int NOT NULL AUTO_INCREMENT, nickname VARCHAR(25), token VARCHAR(36), expired BIT, expirationDate DATETIME, PRIMARY KEY(id));