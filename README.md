# Exploration of Kubernetes based FaaS solutions

This is a final project by three students finishing Bsc. in computer science and software engineering at Reykjavík University. 

​In response to the industry-wide trend favoring lightweight functions over server-based services, this project delves into the exploration of function as a service (FaaS) options on top of Kubernetes. With the primary objective of making well-informed decisions regarding future runtime selections, the project focuses on adapting FaaS frameworks like OpenFaaS and Knative. 

The project's ultimate goal extends beyond its immediate scope. Through the provision of detailed documentation evaluating various FaaS solutions, the project serves as a solid foundation for others seeking to embark on their own FaaS journey. With the intent of streamlining the initial steps involved in FaaS infrastructure setup, the project significantly reduces the time-consuming burden of preliminary research and configuration. Developers can now leverage the insights gained and readily begin crafting their own FaaS solutions. By sharing the knowledge accumulated during the project's research and development phase, this endeavor ultimately aims to support and empower those who aspire to create FaaS setups on Kubernetes.

In conclusion, this project exemplifies the industry's ongoing shift towards lightweight functions and explores the feasibility of FaaS options on Kubernetes. The deliverables encompass a comprehensive infrastructure setup, user-friendly demonstrations, and extensive documentation, all aimed at accelerating the adoption and implementation of FaaS solutions.


# How to run locally (all in terminal):

run frontend:

    cd react_frontend/web_app
    npm start


run Golang test:

    cd functions/make-passw
    go test ./


run pytests:

    pytest

run React tests:

    cd react_frontend
    cd web_app
    npm test

Please refer to the Operating Manual located at the root folder for further information 