# Tic Tac Toe on cloud

## Description

This project implements a Tic Tac Toe game as a web service. 
It includes Terraform configurations for deploying the service to AWS using either EC2 or Beanstalk or Fargate.

## Program structure

tic-tac-toe: 
	Contains the source code for both the frontend and backend of the Tic Tac Toe game, 
	along with their respective Dockerfiles.

terraform:
    - deployment-on-ec2: 
		Terraform files and a Bash script for setting up an EC2 instance, security group, and IP addresses.
    - deployment-on-beanstalk-and-fargate: 
		Terraform files for deploying the code to Beanstalk or Fargate.

## Future Improvements

- Integrate a database (e.g., DynamoDB) to store game results and player statistics.
- Leverage CloudWatch for monitoring application and infrastructure metrics, 
setting up alarms for critical issues, and enabling auto-scaling based on load.
