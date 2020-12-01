Per avviare il server web Apache:

> sudo cp -r Frontend/ /var/www/cdcp
> sudo cp cdcp.conf /etc/apache2/sites-available
> sudo a2enmod proxy_http          # Per il ProxyPass
> sudo a2ensite cdcp.conf
> sudo systemctl reload apache2
> sudo nano /etc/hosts
> echo "127.0.0.1       cdcp www.cdcp cdcp.soi" | sudo tee -a /etc/hosts
