#defines the AWS provider and sets upp the access, secret key and region

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = local.region
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.this.token

}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.this.token
  }
}


#defines local variables to be used within the configuration file. 
#Defines the name of the EKS cluster and VPC, the region in which the resources will be created, 
#the EKS cluster version, the VPC CIDR block, the availability zones, and the tags to be applied to the resources. 

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

#Fetches the available AWS availability zones within the specified region. 
#This information is used later when configuring the VPC and EKS cluster

data "aws_availability_zones" "available" {}

data "aws_eks_cluster_auth" "this" {
    # depends_on = [module.eks]
    name = module.eks.cluster_name
}



data "aws_route53_zone" "your_domain" {
  name = "fabulousasaservice.com"
}


# data "aws_elb" "openfaas" {
#   name = helm_release.openfaas.metadata.0.name
# }




#Imports and configures the VPC module. The VPC module creates a new VPC with the specified name, CIDR block, availability zones, and subnet configurations. 
#It also creates NAT gateways and applies the necessary tags to the public and private subnets.

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

#creates an amazon EKS cluster with managed node groups in the specified VPC and subnets. 

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.12"

  cluster_name    = local.name
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
      desired_size = 2

    }
  }

  tags = local.tags
}


#Terraform configuration which creates two DynamoDB tables
#A "users" table with partition key (user_id) and 
#a "posts" table with a partition key (post_id) and a sort key (timestamp)
#Both tables use on-demand billing mode and are tagged with the "Environment" set to "dev".

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

resource "aws_dynamodb_table" "table2" {
  name           = "posts"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "post_id"

  attribute {
    name = "post_id"
    type = "N"
  }

  range_key = "timestamp"

  attribute {
    name = "timestamp"
    type = "N"
  }

  tags = {
    Environment = "dev"
  }
}

resource "kubernetes_namespace" "openfaas" {
  metadata {
    name = "openfaas-test"
  }
}

resource "kubernetes_namespace" "openfaas_fn" {
  metadata {
    name = "openfaas-fn-test"
  }
}


resource "null_resource" "openfaas_lb" {
  depends_on = [
    helm_release.openfaas,
    kubernetes_namespace.openfaas,
  ]

  provisioner "local-exec" {
    command = <<-EOC
      kubectl get svc gateway-external -n openfaas-test \
        --token="${data.aws_eks_cluster_auth.this.token}" \
        --server="${module.eks.cluster_endpoint}" \
        --insecure-skip-tls-verify=true \
        -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' > lb_hostname.txt
    EOC
  }
}

data "local_file" "lb_hostname" {
  depends_on = [null_resource.openfaas_lb]
  filename   = "lb_hostname.txt"
}



resource "helm_release" "openfaas" {
depends_on = [
    kubernetes_namespace.openfaas  ]
  name       = "openfaas"
  repository = "https://openfaas.github.io/faas-netes/"
  chart      = "openfaas"

  namespace = "openfaas-test"

  set {
    name  = "faasnetes.imagePullPolicy"
    value = "IfNotPresent"
  }

  set {
    name  = "functionNamespace"
    value = "openfaas-fn-test"
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


resource "aws_route53_record" "openfaas_cname" {
  zone_id = data.aws_route53_zone.your_domain.id
  name    = "functions.fabulousasaservice.com"
  type    = "CNAME"
  ttl     = "300"
  records = [data.local_file.lb_hostname.content]
}


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
      namespace          = "openfaas-fn-test"
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
  # Let fluentbit create the cw log group
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

#---------------------------------------------------------------
# ArgoCD Admin Password credentials with Secrets Manager
# Login to AWS Secrets manager with the same role as Terraform to extract the ArgoCD admin password with the secret name as "argocd"
#---------------------------------------------------------------
resource "random_password" "argocd" {
  length           = 16
  upper            = true
  lower            = true
  numeric          = true
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}




resource "aws_secretsmanager_secret" "argocd" {
  name                    = "argocd"
  recovery_window_in_days = 0 # Set to zero for this example to force delete during Terraform destroy
}

resource "aws_secretsmanager_secret" "email_password" {
  name = "email-pass"
}

resource "aws_secretsmanager_secret_version" "email_password" {
  secret_id     = aws_secretsmanager_secret.email_password.id
  secret_string = jsonencode({
    password = var.email_password
  })
}


resource "aws_iam_role_policy_attachment" "worker_node_permissions_attachment" {
  policy_arn = aws_iam_policy.worker_node_permissions.arn
  role = replace(module.eks.eks_managed_node_groups["initial"].iam_role_arn, "arn:aws:iam::112172658395:role/", "")
}


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

resource "kubernetes_deployment" "my-app" {
  metadata {
    name = "my-app"
  }

  spec {
    replicas = 1

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
          image = "112172658395.dkr.ecr.eu-west-1.amazonaws.com/react-wep-app:web-app-v19"

          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

resource "aws_ecr_repository" "faas_function_repository" {
  name = "faas-function-repository"
}

resource "aws_ecr_repository" "react_web_app" {
  name = "react-web-app"
}


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

resource "kubernetes_namespace" "grafana" {
  metadata {
    name = "grafana"
  }
}


resource "aws_route53_record" "grafana_cname" {
  zone_id = data.aws_route53_zone.your_domain.id
  name    = "grafana.fabulousasaservice.com"
  type    = "CNAME"
  ttl     = "300"
  records = [data.local_file.lb_hostname.content]
}


resource "helm_release" "grafana" {
  name       = "grafana"
  namespace  = "grafana"
  repository = "https://grafana.github.io/helm-charts"
  chart      = "grafana"

  values = [
    <<-EOT
    service:
      type: ClusterIP
    EOT
  ]
}

resource "kubernetes_ingress" "grafana" {
  metadata {
    name      = "grafana-ingress"
    namespace = "grafana"
  }

  spec {
    rule {
      host = "grafana.fabulousasaservice.com"

      http {
        path {
          backend {
            service_name = helm_release.grafana.metadata[0].name
            service_port = 80
          }
          path = "/"
        }
      }
    }
  }
}


