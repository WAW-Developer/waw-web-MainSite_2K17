# Howtos for Vagrant VM
In order to provide an 'easy to deploy' development environment... nowadays is normal to use virtual machines (VM).
For this purpose this project uses Vagrant.
The service for HTTP is based on nginx.

## How to deploy Vagrant VM
vagrant up --provision

## How to start Vagrant VM
vagrant up

## How to stop Vagrant VM
vagrant halt

## How to access Vagrant VM
vagrant ssh

## How to start service (in VM)
sudo service nginx start
and then access to http://localhost:8932/html/
or https://localhost:8933/html/



# Howtos for package dependecies 
The project uses NodeJS as the base framework for transpile EcmaScript library into one file.
Also uses frameworks and libraries that can be installed using different package managers.
All the software is running on the VM.

## How to install node packages
cd wawsite
npm install --no-bin-links

## How to install bower packages
cd wawsite
bower install


## How to build wawsite
cd wawsite
gulp buildandcopyWAWSite

## How to copy libraries
gulp copyLibs

## How to copy web components
gulp copy_WebComponents

## How to build and copy all the necessary files at once...
gulp buildAndDeployAll

