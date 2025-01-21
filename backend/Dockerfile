# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy backend files into the container
COPY . .

# Install dependencies
RUN npm install

# Expose the backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
