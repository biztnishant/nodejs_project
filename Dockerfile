# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

RUN npm run build

EXPOSE 4000

# Define the command to run the application
CMD ["node", "dist/index.js"]
