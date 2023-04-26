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
