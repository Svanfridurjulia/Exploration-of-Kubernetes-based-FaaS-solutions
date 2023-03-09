# Exploration of Kubernetes based FaaS solutions

This project is the final project for three students finishing Bsc. in computer science and software engineering. 

In this project we aim to explore the landscape for FaaS (Function as a Service) options on top of Kubernetes. The large cloud vendors have their own FaaS solutions such as AWS:Lambda, but that involves a different runtime, metrics and monitoring services for companies that are already running everything on Kubernetes. In this project, we want to explore how we can adapt a FaaS framework like OpenFaaS or KNative to help us make a well informed decision on what runtime we should choose for the future.  

# How to run (all in terminal):

run frontend:

    cd React_Frontend/web_app
    npm start

run middleware: 

    cd Middleware
    npm start

run OpenFaaS function:

    kubectl port-forward -n openfaas svc/gateway 8080:8080



