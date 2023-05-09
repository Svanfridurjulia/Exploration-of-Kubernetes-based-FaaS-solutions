# Providers

# Defines the AWS provider and sets upp the access, secret key and region

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = local.region
}

# Defines the Kubernetes provider and sets up the host, cluster_ca_certificate and token

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.this.token

}

# Defines the Helm provider and sets up the Kubernetes configuration

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.this.token
  }
}


# Locals

# Defines local variables to be used within the configuration file. 

locals {
  name   = basename(path.cwd)
  region = "eu-west-1"

  cluster_version = "1.24"

  vpc_cidr = "10.0.0.0/16"
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)

  tags = {
    Blueprint  = local.name
    GithubRepo = "github.com/aws-ia/terraform-aws-eks-blueprints"
  }
}


# Data: Setting up global data that is used in multiple places throughout the configuration file

# Fetches the available AWS availability zones within the specified region. 
# This information is used later when configuring the VPC and EKS cluster

data "aws_availability_zones" "available" {}

# Fetches the authentication information for the EKS cluster

data "aws_eks_cluster_auth" "this" {
  name = module.eks.cluster_name
}

# The name of the domain that is used for configuring routing  

data "aws_route53_zone" "your_domain" {
  name = "fabulousasaservice.com"
}


# Resources: Includes all the stand alone or smaller resources being configured

# Creates the ECR repository for holding the OpenFaaS function images

resource "aws_ecr_repository" "faas_function_repository" {
  name = "faas-function-repository"
}

# Creates the ECR repository for holding the image for the frontend app

resource "aws_ecr_repository" "react_web_app" {
  name = "react-web-app"
}

# Creates the AWS secret for holding the email password used in the send-email function

resource "aws_secretsmanager_secret" "email_password" {
  name = "admin-email-password"
  recovery_window_in_days = 0 

}

# Setting the value of the email secret

resource "aws_secretsmanager_secret_version" "email_password" {
  secret_id     = aws_secretsmanager_secret.email_password.id
  secret_string = jsonencode({
    password = var.email_password
  })
}

# Creates an IAM policy which sets the needed permissions for the worker nodes in the cluster

resource "aws_iam_policy" "worker_node_permissions" {
  name        = "worker-node-permissions"
  description = "Policy for EKS worker nodes to access DynamoDB and Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:*"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "ec2:Describe*",
          "ec2:AttachVolume",
          "ec2:DetachVolume",
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Assigning the created policy to the worker node group

resource "aws_iam_role_policy_attachment" "worker_node_permissions_attachment" {
  policy_arn = aws_iam_policy.worker_node_permissions.arn
  role = replace(module.eks.eks_managed_node_groups["initial"].iam_role_arn, "arn:aws:iam::112172658395:role/", "")
}


# VPC

# Imports and configures the VPC module. The VPC module creates a new VPC with the specified name, CIDR block, availability zones, and subnet configurations. 
# It also creates NAT gateways and applies the necessary tags to the public and private subnets.

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 4.0"

  name = local.name
  cidr = local.vpc_cidr

  azs             = local.azs
  private_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 4, k)]
  public_subnets  = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 48)]

  enable_nat_gateway = true
  single_nat_gateway = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }

  tags = local.tags
}


# EKS

# Creates an amazon EKS cluster with managed node groups in the specified VPC and subnets. 
# The managed node groups is created with instance types t3.medium

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.12"

  cluster_name    = "FinalEKSCluster"
  cluster_version = local.cluster_version

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access = true
  cluster_endpoint_public_access_cidrs = ["0.0.0.0/0"]
  
  eks_managed_node_groups = {
    initial = {
      instance_types = ["t3.medium"]

      min_size     = 0
      max_size     = 7
      desired_size = 7

    }
  }

  tags = local.tags
}


# DynamoDB

# Creates a DynamoDB Table for storing user data and sets the partition key as user_id

resource "aws_dynamodb_table" "table1" {
  name           = "users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "user_id"

  attribute {
    name = "user_id"
    type = "N"
  }

  tags = {
    Environment = "dev"
  }
}

# Creates a DynamoDB Table for storing post data and sets the partition key as post_id

resource "aws_dynamodb_table" "table2" {
  name           = "posts"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "post_id"

  attribute {
    name = "post_id"
    type = "N"
  }

  tags = {
    Environment = "dev"
  }
}


#OpenFaaS: Includes all blocks needed to set up and configure OpenFaaS on the EKS cluster

# Creates a Kubernetes namespace which will hold the management deployments for OpenFaaS
  # This includes: Alert Manager, Gateway, Nats, Prometheus and Queue-worker

resource "kubernetes_namespace" "openfaas" {
  metadata {
    name = "openfaas"
  }
}

# Creates a Kubernetes namespace which will hold the OpenFaaS functions

resource "kubernetes_namespace" "openfaas_fn" {
  metadata {
    name = "openfaas-fn"
  }
}

# Resource block which deploys the OpenFaaS platform to the Kubernetes cluster to the corresponding namespaces

resource "helm_release" "openfaas" {
depends_on = [
    kubernetes_namespace.openfaas  ]
  name       = "openfaas"
  repository = "https://openfaas.github.io/faas-netes/"
  chart      = "openfaas"

  namespace = "openfaas"

  set {
    name  = "faasnetes.imagePullPolicy"
    value = "IfNotPresent"
  }

  set {
    name  = "functionNamespace"
    value = "openfaas-fn"
  }

  set {
    name  = "generateBasicAuth"
    value = "true"
  }

  set {
    name  = "serviceType"
    value = "LoadBalancer"
  }

}

# Null resource used to write the external hostname of the load balancer used for invoking and deploying the OpenFaaS functions
# The value is used to configure the routing of the functions domain

resource "null_resource" "openfaas_lb" {
  depends_on = [
    helm_release.openfaas,
    kubernetes_namespace.openfaas,
  ]

  provisioner "local-exec" {
    command = <<-EOC
      kubectl get svc gateway-external -n openfaas \
        --token="${data.aws_eks_cluster_auth.this.token}" \
        --server="${module.eks.cluster_endpoint}" \
        --insecure-skip-tls-verify=true \
        -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' > lb_hostname.txt
    EOC
  }
}

# Data used to be able to access the hostname of the functions load balancer 

data "local_file" "lb_hostname" {
  depends_on = [null_resource.openfaas_lb]
  filename   = "lb_hostname.txt"
}

# Route53 record which configures the routing of the functions.fabulousasaservice.com domain to point to the external hostname of the functions load balancer

resource "aws_route53_record" "openfaas_cname" {
  zone_id = data.aws_route53_zone.your_domain.id
  name    = "functions.fabulousasaservice.com"
  type    = "CNAME"
  ttl     = "300"
  records = [data.local_file.lb_hostname.content]
}



#ArgoCD: Includes all blocks needed to set up the ArgoCD deployment on the cluster

# This block generates a random password to be used as the admin password for the ArgoCD application.
# The password will have a length of 16 characters and will contain at least one uppercase letter, 
# one lowercase letter, one digit, and one special character.

resource "random_password" "argocd" {
  length           = 16
  upper            = true
  lower            = true
  numeric          = true
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# This block creates an AWS Secrets Manager secret to store the admin password for the ArgoCD application.

resource "aws_secretsmanager_secret" "argocd" {
  name                    = "argocd"
  recovery_window_in_days = 0 
}

# Module for adding Kubernetes add-ons to the EKS cluster, including ArgoCD, KEDA, and Prometheus

module "eks_blueprints_kubernetes_addons" {
  source = "git::https://github.com/aws-ia/terraform-aws-eks-blueprints.git//modules/kubernetes-addons"


  eks_cluster_id       = module.eks.cluster_name
  eks_cluster_endpoint = module.eks.cluster_endpoint
  eks_oidc_provider    = module.eks.oidc_provider
  eks_cluster_version  = module.eks.cluster_version

  enable_argocd = true

  argocd_helm_config = {
  set_sensitive = [
    {
      name  = "configs.secret.argocdServerAdminPassword"
      value = random_password.argocd.result
    }
  ]
  set = [
      {
        name  = "controller.repoServer.timeoutSeconds"
        value = "60" # Set the desired timeout value in seconds
      }
    ]
}

  keda_helm_config = {
    values = [
      {
        name  = "serviceAccount.create"
        value = "false"
      }
    ]
  }

  argocd_manage_add_ons = true # Indicates that ArgoCD is responsible for managing/deploying add-ons
  argocd_applications = {
    addons = {
      path               = "chart"
      repo_url           = "https://github.com/aws-samples/eks-blueprints-add-ons.git"
      add_on_application = true
    }
    workloads = {
      path               = "envs/dev"
      repo_url           = "https://github.com/aws-samples/eks-blueprints-workloads.git"
      add_on_application = false
    }
     openfaas = {
      path               = "functions/charts/openfaas-functions/"
      repo_url           = "https://github.com/Svanfridurjulia/Exploration-of-Kubernetes-based-FaaS-solutions.git"
      target_revision    = "Svanfríður"
      add_on_application = false
      project_name       = "openfaas"
      namespace          = "openfaas-fn"
      sync_policy        = "automated"
      sync_options       = {
        validate = true
        prune    = true
      }
    }
  }

  # Add-ons
  enable_amazon_eks_aws_ebs_csi_driver = false
  enable_aws_for_fluentbit             = false
 
  aws_for_fluentbit_create_cw_log_group = false
  enable_cert_manager                   = false
  enable_cluster_autoscaler             = false
  enable_karpenter                      = false
  enable_keda                           = false
  enable_metrics_server                 = false
  enable_prometheus                     = true
  enable_traefik                        = false
  enable_vpa                            = false
  enable_yunikorn                       = false
  enable_argo_rollouts                  = true

  tags = local.tags
}


# Web App: All blocks needed to set up the deployment for the web app

# Defines a Kubernetes deployment for the containerized application which is the web app

resource "kubernetes_deployment" "my-app" {
  metadata {
    name = "my-app"
  }

  spec {
    replicas = 3

    selector {
      match_labels = {
        app = "my-app"
      }
    }

    template {
      metadata {
        labels = {
          app = "my-app"
        }
      }

      spec {
        container {
          name  = "my-app"
          image = "112172658395.dkr.ecr.eu-west-1.amazonaws.com/react-web-app:web-app-v1"
          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

# Block which creates a Kubernetes service that exposes the web app deployment. 

resource "kubernetes_service" "my-app" {
  metadata {
    name = "my-app"
    annotations = {
      "service.beta.kubernetes.io/aws-load-balancer-backend-protocol" = "http"
    }
  }

  spec {
    selector = {
      app = "my-app"
    }

    type = "LoadBalancer"

    port {
      protocol    = "TCP"
      port        = 80
      target_port = 3000
    }
  }
}

# Null resource used to write the external hostname of the load balancer defined in the Kubernetes service for the web app
# The value is used to configure the routing of the web app domain

resource "null_resource" "my_app_lb" {
  depends_on = [
    kubernetes_deployment.my-app
  ]

  provisioner "local-exec" {
    command = <<-EOC
      kubectl get svc my-app \
        --token="${data.aws_eks_cluster_auth.this.token}" \
        --server="${module.eks.cluster_endpoint}" \
        --insecure-skip-tls-verify=true \
        -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' > my_app_lb_hostname.txt
    EOC
  }
}

# Data used to be able to access the hostname of the web app load balancer 

data "local_file" "my_app_lb_hostname" {
  depends_on = [null_resource.my_app_lb]
  filename   = "my_app_lb_hostname.txt"
}

# Route53 record which configures the routing of the web-app.fabulousasaservice.com domain to point to the external hostname of the web app load balancer

resource "aws_route53_record" "app_cname" {
  zone_id = data.aws_route53_zone.your_domain.id
  name    = "web-app.fabulousasaservice.com"
  type    = "CNAME"
  ttl     = "300"
  records = [data.local_file.my_app_lb_hostname.content]
}


# Grafana: Includes all blocks needed to set up the Grafana deployment on the cluster

# Creates the Kubernetes namespace used to hold the Grafana deployment

resource "kubernetes_namespace" "grafana" {
  metadata {
    name = "grafana"
  }
}

# Creates a Helm release for Grafana and installs it in the corresponding namespace and configures a Prometheus data source

resource "helm_release" "grafana" {
  name       = "grafana"
  namespace  = "grafana"
  repository = "https://grafana.github.io/helm-charts"
  chart      = "grafana"

  values = [
    <<-EOT
    service:
      type: LoadBalancer

    EOT
  ]
}

# Null resource used to write the external hostname of the loadbalancer defined in the Helm release for Grafana
# The value is used to configure the routing of the Grafana domain

resource "null_resource" "grafana_lb" {
  depends_on = [
    helm_release.grafana,
    kubernetes_namespace.grafana,
  ]

  provisioner "local-exec" {
    command = <<-EOC
      kubectl get svc grafana -n grafana \
        --token="${data.aws_eks_cluster_auth.this.token}" \
        --server="${module.eks.cluster_endpoint}" \
        --insecure-skip-tls-verify=true \
        -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' > grafana_lb_hostname.txt
    EOC
  }
}

# Data used to be able to access the hostname of the Grafana load balancer

data "local_file" "grafana_lb_hostname" {
  depends_on = [null_resource.grafana_lb]
  filename   = "grafana_lb_hostname.txt"
}

# Route53 record which configures the routing of the grafana.fabulousasaservice.com domain to point to the external hostname of the Grafana load balancer

resource "aws_route53_record" "grafana_cname" {
  zone_id = data.aws_route53_zone.your_domain.id
  name    = "grafana.fabulousasaservice.com"
  type    = "CNAME"
  ttl     = "300"
  records = [data.local_file.grafana_lb_hostname.content]
}