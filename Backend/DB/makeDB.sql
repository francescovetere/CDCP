-- sudo mysql -u root -p < db_creation.sql
CREATE DATABASE IF NOT EXISTS CDCP_DB;
USE CDCP_DB;

CREATE TABLE IF NOT EXISTS Users (id VARCHAR(36) PRIMARY KEY, nickname VARCHAR(25), email VARCHAR(50), password VARCHAR(255), registrationDate DATETIME);
CREATE TABLE IF NOT EXISTS Projects (id VARCHAR(36) PRIMARY KEY, title VARCHAR(50), inputType VARCHAR(20));
CREATE TABLE IF NOT EXISTS Examples (id VARCHAR(36) PRIMARY KEY, projectId VARCHAR(36), inputType VARCHAR(20), inputValue VARCHAR(100), FOREIGN KEY (projectId) REFERENCES Projects(id));
CREATE TABLE IF NOT EXISTS Labels (id VARCHAR(36), projectId VARCHAR(36), tagName VARCHAR(36), FOREIGN KEY (projectId) REFERENCES Projects(id), exampleId VARCHAR(36), FOREIGN KEY (exampleId) REFERENCES Examples(id), PRIMARY KEY (projectId, exampleId, tagName));
CREATE TABLE IF NOT EXISTS TagValues (id VARCHAR(36), projectId VARCHAR(36), exampleId VARCHAR(36), tagName VARCHAR(36), tagValue VARCHAR(36), FOREIGN KEY (projectId, exampleId, tagName) REFERENCES Labels(projectId, exampleId, tagName), PRIMARY KEY(projectId, exampleId, tagName));
CREATE TABLE IF NOT EXISTS Logs (id VARCHAR(36) PRIMARY KEY, exampleId VARCHAR(36), details VARCHAR(255), timeStamp DATETIME, FOREIGN KEY (exampleId) REFERENCES Examples(id), projectId VARCHAR(36), FOREIGN KEY (projectId) REFERENCES Projects(id), userId VARCHAR(36), FOREIGN KEY (userId) REFERENCES Users(id), actionType VARCHAR(50));
