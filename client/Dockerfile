# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install serve globally
RUN npm install -g serve

# Copy the build artifacts from the build stage
COPY --from=build /usr/src/app/build /usr/src/app/build

# Expose port 5000 (default port for serve)
EXPOSE 3000

# Start serve
CMD ["serve", "-s", "build", "-l", "3000"]
