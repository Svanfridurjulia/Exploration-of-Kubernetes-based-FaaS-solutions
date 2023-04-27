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

    #    vpc_config = {
    #     endpoint_public_access = true
    #     public_access_cidrs    = ["0.0.0.0/0"]
    #   }
  
  eks_managed_node_groups = {
    initial = {
      instance_types = ["m5.large"]

      min_size     = 1
      max_size     = 3
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

module "eks_blueprints_kubernetes_addons" {
  source = "git::https://github.com/aws-ia/terraform-aws-eks-blueprints.git//modules/kubernetes-addons"


  eks_cluster_id       = module.eks.cluster_name
  eks_cluster_endpoint = module.eks.cluster_endpoint
  eks_oidc_provider    = module.eks.oidc_provider
  eks_cluster_version  = module.eks.cluster_version

  enable_argocd = true
  # This example shows how to set default ArgoCD Admin Password using SecretsManager with Helm Chart set_sensitive values.
  argocd_helm_config = {
  set_sensitive = [
    {
      name  = "configs.secret.argocdServerAdminPassword"
      value = random_password.argocd.result
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
  enable_amazon_eks_aws_ebs_csi_driver = true
  enable_aws_for_fluentbit             = true
  # Let fluentbit create the cw log group
  aws_for_fluentbit_create_cw_log_group = false
  enable_cert_manager                   = true
  enable_cluster_autoscaler             = true
  enable_karpenter                      = true
  enable_keda                           = true
  enable_metrics_server                 = true
  enable_prometheus                     = true
  enable_traefik                        = true
  enable_vpa                            = true
  enable_yunikorn                       = true
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
  number          = true
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}




#tfsec:ignore:aws-ssm-secret-use-customer-key
resource "aws_secretsmanager_secret" "argocd" {
  name                    = "argocd"
  recovery_window_in_days = 0 # Set to zero for this example to force delete during Terraform destroy
}

resource "aws_secretsmanager_secret_version" "argocd" {
  secret_id     = aws_secretsmanager_secret.argocd.id
  secret_string = random_password.argocd.result
}