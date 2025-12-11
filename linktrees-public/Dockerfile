# this line is used to pull the node:25-alpine image from the docker hub
FROM node:22.20.0

# this line is used to set the working directory for the container
WORKDIR /linktrees-public

# this line is used to copy the package.json and package-lock.json files from the current directory to the working directory
COPY package*.json ./

# this line is used to install the dependencies for the project
RUN npm install

# this line is used to copy the rest of the files from the current directory to the working directory
COPY . .

# this line is used to build the project
RUN npm run build

# this line is used to set the port for the project 
ENV PORT=3003

# this line is used to expose the port to the outside world
EXPOSE $PORT

# this line is used to start the project by running the start script
CMD ["npm", "run", "dev"]
