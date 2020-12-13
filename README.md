# Collaborative Data Curation Platform 

This repository contains the final project for the course "Internet Oriented Systems" of the Master's Degree in Computer Engineering @ University of Parma.

### Database Setup
In order to correctly execute the Node server, **MySQL server** is required.
A [start.sh](/Backend/start.sh) script is already provided: it runs both MySQL DB (automatically creating a database described in [makeDB.sql](/Backend/DB/makeDB.sql) file) and the Node server, so all you have to do is execute it:

```bash
> cd Backend
> ./start.sh
```

### Node server setup
Server is written in **Node.js**. Before you run the server, you'll need to install some dependecies:

```bash
> cd Backend
> npm install
```

### Apache server setup
An Apache server is required, which you can configure with the file provided in [cdcp.conf](/Apache/cdcp.conf): with this configuration, the Apache server will run on port 80, and it will automatically redirect all API requests to the Node server listening on port 8000.
These will be the typical commands you have to run in order to properly setup your Apache server:

```bash
> sudo cp -r Frontend/ /var/www/cdcp
> sudo cp cdcp.conf /etc/apache2/sites-available
> sudo a2enmod proxy_http # in order to have the 'ProxyPass' command working
> sudo a2ensite cdcp.conf
> sudo systemctl reload apache2
> echo "127.0.0.1 cdcp www.cdcp cdcp.soi" | sudo tee -a /etc/hosts
```

## First Use of Web App
After you successfully started MySQL, Node and Apache servers, you can point your browser to http://cdcp (or other aliases configured), and begin to interact with the web app.
At first, you'll be asked to register yourself as a user. Then, you can login with your credentials and begin to use the web app.


## Authors

Giuseppe La Gualano <<giuseppe.lagualano@studenti.unipr.it>>

Francesco Vetere <<francesco.vetere@studenti.unipr.it>>

## License

This project is licensed under MIT license. See [LICENSE](LICENSE) file for details.
