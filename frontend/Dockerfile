# Use an official Nginx image as the base image
FROM nginx:alpine

# Install testing dependencies
RUN npm install --save-dev jest

# Copy the static frontend files into the container
COPY . /usr/share/nginx/html

# Expose port 80 to make the app accessible
EXPOSE 80
