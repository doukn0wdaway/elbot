FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install iputils (ping and related networking tools)
RUN apt-get update && apt-get install -y iputils-ping

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (if needed)
RUN yarn

# Copy the script
COPY . .

# Command to run build and start
CMD ["sh", "-c", "yarn build && yarn start"]


