FROM node:14.17-alpine
WORKDIR /app/web_app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "serve"]
