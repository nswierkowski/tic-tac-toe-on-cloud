terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.1"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}


resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name = "my-vpc-01"
  }
}

resource "aws_internet_gateway" "gateway" {
  vpc_id = aws_vpc.my_vpc.id
  
  tags = {
    Name = "gateway-01"
  }
}

resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.my_vpc.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gateway.id
  }

  tags = {
    Name = "route-table-01"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id     = aws_vpc.my_vpc.id
  cidr_block = "10.0.101.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "public-subnet"
  }
}

resource "aws_route_table_association" "association_subnet_route" {
  subnet_id = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.route_table.id
}

resource "aws_security_group" "allow_ssh_http" {
    name = "allow_ssh_http"
    description = "Allow SSH and HTTP inbound traffic and all outbound traffic"
    vpc_id = aws_vpc.my_vpc.id


    tags = {
        Name = "allow-ssh-http"
    }
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
    security_group_id = aws_security_group.allow_ssh_http.id
    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = "-1"
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_8080" {
    security_group_id = aws_security_group.allow_ssh_http.id
    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = "tcp"
    from_port = 8080
    to_port = 8080
}


resource "aws_vpc_security_group_ingress_rule" "allow_http_3000" {
    security_group_id = aws_security_group.allow_ssh_http.id
    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = "tcp"
    from_port = 3000
    to_port = 3000
}

resource "aws_vpc_security_group_ingress_rule" "allow_ssh" {
    security_group_id = aws_security_group.allow_ssh_http.id
    cidr_ipv4 = "0.0.0.0/0"
    ip_protocol = "tcp"
    from_port = 22
    to_port = 22
}

