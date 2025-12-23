# this line is used to pull the node:25-alpine image from the docker hub
FROM node:22.20.0

# this line is used to set the working directory for the container
WORKDIR /linktrees-management

# this line is used to copy the package.json and package-lock.json files from the current directory to the working directory
COPY package*.json ./

# this line is used to install the dependencies for the project
RUN npm install

# this line is used to copy the rest of the files from the current directory to the working directory
COPY . .

# this line is used to build the project
RUN npm run build

# this line is used to set the port for the project 
ENV PORT=3002

# this line is used to expose the port to the outside world
EXPOSE $PORT

# this line is used to start the project in production.
# We use the "start" script, which first runs migrations and then starts the server.
CMD ["npm", "start"]
