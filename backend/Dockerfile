# Use a lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package manifests first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Create directory for SQLite data inside the container
RUN mkdir -p /data

# Environment variables
ENV NODE_ENV=production
# Let Sequelize know where to store the SQLite database file
ENV DATABASE_URL=/data/database.sqlite

# Expose backend port
EXPOSE 4000

# Start the backend using tsx (no need for build step)
CMD ["npx", "tsx", "server.ts"]
