#!/bin/bash

pathkey=/etc/nginx/ssl/nginx.key
pathcrt=/etc/nginx/ssl/nginx.crt


#if [ $# -eq 0 ]
#  then
#    echo "No arguments supplied"
#fi


if [ "$#" -ne 2 ]
then 
    echo usage: $0 pathkey pathcrt
    exit 1
fi


## generate keys
## sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $pathkey -out $pathcrt
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $1 -out $2
