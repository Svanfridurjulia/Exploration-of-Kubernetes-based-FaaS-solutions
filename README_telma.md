This branch contains a Golang basic code for OpenFaas.

##How to use openfaas in browser
Terminal:
kubectl get secret -n openfaas basic-auth -o json
PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)
echo $PASSWORD

#Browser:
go to localhost:8080 on browser and put in user = admin and password as seen above. Now you are in openfaas gateway on browser.

#Terminal:
echo -n $PASSWORD | faas-cli login -s

##GO code setup
#Terminal 1:
cd openfaas/
faas-cli template store list
faas-cli template store pull golang-middleware
faas-cli new basego --lang golang-middleware

#VSC:
Make sure to change the image line in the yml file you just created. You want to add <user>/ before the name you chose. You must provide a username or registry prefix to the Function's image such as user1/function1

#Terminal 2:
kubectl port-forward -n openfaas svc/gateway 8080:8080

#Terminal 1:
faas-cli build -f basego.yml
docker images
echo -n $PASSWORD | faas-cli login -s
faas-cli push -f basego.yml
faas-cli deploy -f basego.yml
kubectl get pods -n openfaas-fn
