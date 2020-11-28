#!/bin/bash

DOC_ROOT=/var/www/cdcp
if ! [ -d $DOC_ROOT ]; then
    mkdir $DOC_ROOT
    cp -r /vagrant/labs/cdcp/* $DOC_ROOT/
    cp /vagrant/labs/cdcp/.htaccess $DOC_ROOT/
fi

if ! grep cdcp /etc/hosts &> /dev/null; then
    echo "127.0.0.1       cdcp www.cdcp cdcp.soi" | sudo tee -a /etc/hosts
fi

if ! [ -f /etc/apache2/sites-available/cdcp.conf ]; then
    sudo cp /vagrant/provision/cdcp.conf /etc/apache2/sites-available/cdcp.conf
    sudo a2ensite cdcp
    sudo systemctl reload cdcp
fi
