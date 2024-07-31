#!/bin/bash

# Install docker
sudo apt-get update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install docker-compose
sudo curl -SL https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Get machine IP
API_URL="http://169.254.169.254/latest/api"
TOKEN=`curl -X PUT "$API_URL/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 600"` 
TOKEN_HEADER="X-aws-ec2-metadata-token: $TOKEN"
METADATA_URL="http://169.254.169.254/latest/meta-data"
IP_V4=`curl -H "$TOKEN_HEADER" -s $METADATA_URL/public-ipv4`

# Get repo
git clone https://github.com/nswierkowski/tic-tac-toe.git
cd tic-tac-toe/

# Set the backend ip
echo "REACT_APP_API_URL=http://$IP_V4:8080" > .env

# Run docker compose:
sudo docker-compose --env-file .env up -d