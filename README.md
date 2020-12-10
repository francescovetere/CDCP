# Collaborative Data Curation Platform 

This repository contains the final project for the course "Internet Oriented Systems" of the Master's Degree in Computer Engineering @ University of Parma.

## Domain name and Folder
We used to config **Apache** Web Server a virtual host (http only) that he points to **"cdcp/Frontend"** folder in /var/www. So you can clone the entire repo without separate Frontend and Backend. 

```conf
<VirtualHost *:80>
    ServerName cdcp
    ServerAlias www.cdcp cdcp.soi
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/cdcp/Frontend
    LogLevel info
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    ProxyPass     /api/        http://localhost:8000/
</VirtualHost>
```

If you want to modify this, you have to change the cookies's domain for "deleteCookie" function in [login_page.js](/Frontend/js/login_page.js). 

```JavaScript
deleteCookie(name, "/", "cdcp");
```
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
