FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Copy the OpenFaaS watchdog binary file to the image
COPY --from=openfaas/of-watchdog:0.8.2 /fwatchdog /usr/bin/fwatchdog

# Set the command to run your function
CMD ["fwatchdog"]
