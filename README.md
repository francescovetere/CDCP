# Collaborative Data Curation Platform 

This repository contains the final project for the course "Internet Oriented Systems" of the Master's Degree in Computer Engineering @ University of Parma.

### Database Setup

Before you start, you need **MySQL server** on your machine. 

Then, you have to **configure** your account and password.

**If you don't want to modify any scripts**, you can set in your MySQL config "root" user with "root" password. This is the default config our script:

```bash
PSW="root"
mysql -u root -p$PSW < DB/makeDB.sql
```

### Server Installation and Start
You need **Node.js** and so you can execute [start.sh](/Backend/start.sh) to start the server and **create automatically** DB and necessary tables.

```bash
> sudo ./start.sh
```
This script contains the startup and configuration of the database server and server node.

## First Use of Web App
After successfully starting the server server, you can go to http://cdcp/ (or other aliases configured) and register a user. Then, proceed to login.


## Authors

Giuseppe La Gualano <<giuseppe.lagualano@studenti.unipr.it>>

Francesco Vetere <<francesco.vetere@studenti.unipr.it>>

## License

This project is licensed under MIT license. See [LICENSE](LICENSE) file for details.
