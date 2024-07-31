resource "aws_s3_bucket" "beanstalk-bucket-ttt-31245" {
  bucket = "beanstalk-bucketbucket-ttt-31245"
}

resource "aws_s3_object" "tic-tac-toe-object" {
  bucket = aws_s3_bucket.beanstalk-bucket-ttt-31245.bucket
  key    = "app.jar"
  source = "tic-tac-toe.zip"
  acl    = "private"
}

resource "aws_elastic_beanstalk_application" "app" {
  name        = "tic-tac-toe"
  description = "Exercise 7"
}

resource "aws_elastic_beanstalk_application_version" "beanstalk-app-version" {
  application = aws_elastic_beanstalk_application.app.name
  bucket      = aws_s3_bucket.beanstalk-bucket-ttt-31245.id
  key         = aws_s3_object.tic-tac-toe-object.id
  name        = "V1"
}

resource "aws_elastic_beanstalk_environment" "ttt-beanstalk-env" {
  name                = "ttt-beanstalk-env"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.3.0 running Docker"
  cname_prefix = "ttt-beanstalk-env"
  tier = "WebServer"
  version_label       = aws_elastic_beanstalk_application_version.beanstalk-app-version.name

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "EC2KeyName"
    value     = "vockey"
  }
  setting { 
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "arn:aws:iam::730335345074:instance-profile/LabInstanceProfile"
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.allow_ssh_http.id
  }
  setting {
    namespace = "aws:ec2:instances"
    name      = "SupportedArchitectures"
    value     = "x86_64"
  }
  setting { 
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.my_vpc.id
  }
  setting { 
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = aws_subnet.public_subnet.id
  }
  setting { 
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "true"
  }
  setting { 
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = "arn:aws:iam::730335345074:role/LabRole"
  }
}

