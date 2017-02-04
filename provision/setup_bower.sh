#!/bin/bash

echo "Installing nodejs"
curl -sL https://deb.nodesource.com/setup | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm