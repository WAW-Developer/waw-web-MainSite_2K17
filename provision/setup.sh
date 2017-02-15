#!/bin/bash

echo "Provisioning virtual machine..."


echo "Installing Git"
apt-get install git -y
    
echo "Installing Nginx"
apt-get install nginx -y

echo "Configuring Nginx"
cp /var/www/provision/config/nginx_vhost /etc/nginx/sites-available/nginx_vhost
ln -s /etc/nginx/sites-available/nginx_vhost /etc/nginx/sites-enabled/
rm -rf /etc/nginx/sites-available/default
service nginx restart

# install node.js
# sudo apt-get install -y nodejs 
# sudo apt-get install -y npm

# install bower
# npm install -g bower

# install polymer-cli
# npm install -g polymer-cli

