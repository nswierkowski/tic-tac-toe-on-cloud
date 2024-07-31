resource "aws_ecs_cluster" "tic-tac-toe-ecs-cluster" { 
  name = "tic-tac-toe-ecs-cluster"
}

resource "aws_ecs_task_definition" "backend-task-def" { 
  family = "tic-tac-toe"
  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"
  task_role_arn = "arn:aws:iam::730335345074:role/LabRole"
  execution_role_arn = "arn:aws:iam::730335345074:role/LabRole"
  cpu = "1024"
  memory = "2048"
  container_definitions = jsonencode([
    {
      name = "ttt_backend"
      image = "nikodem02/ttt_backend:latest"
      essential = true
      cpu = 1024
      portMappings = [
        {
          containerPort = 8080,
          hostPort = 8080,
          protocol = "tcp"
        },
      ],
    }
  ])
}

resource "aws_ecs_service" "backend-service" {
  name = "backend-service"
  cluster = aws_ecs_cluster.tic-tac-toe-ecs-cluster.id
  task_definition = aws_ecs_task_definition.backend-task-def.arn
  desired_count = 1
  launch_type = "FARGATE" 

  network_configuration {
    subnets = [aws_subnet.public_subnet.id]
    security_groups = [aws_security_group.allow_ssh_http.id]
    assign_public_ip = true
  }
}