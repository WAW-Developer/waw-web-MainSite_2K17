#!/bin/bash

echo "Provisioning virtual machine..."


echo "Installing Git"
apt-get install git -y > /dev/null
    
echo "Installing Nginx"
apt-get install nginx -y > /dev/null

echo "Configuring Nginx"
cp /var/www/provision/config/nginx_vhost /etc/nginx/sites-available/nginx_vhost > /dev/null
ln -s /etc/nginx/sites-available/nginx_vhost /etc/nginx/sites-enabled/
rm -rf /etc/nginx/sites-available/default
service nginx restart > /dev/null

# install node.js
# sudo apt-get install -y nodejs 
# sudo apt-get install -y npm

# install bower
# npm install -g bower

# install polymer-cli
# npm install -g polymer-cli

