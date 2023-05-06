# Exploration of Kubernetes based FaaS solutions

This is a final project by three students finishing Bsc. in computer science and software engineering at Reykjavík University. 

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


run Golang tests:

    cd functions/make-passw
    go test ./


run pytests:

    cd functions
    pytest

run React tests:

    cd React_frontend
    cd web_app
    npm test