# Start from the Node.js image (Debian-based)
FROM node:18

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) first to leverage Docker cache
COPY package*.json ./

# Install dependencies (including pg and Sequelize)
RUN npm install

# Install testing dependencies
RUN npm install --save-dev jest supertest

# Copy the rest of the application files
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
