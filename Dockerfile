# Use Node.js base image
FROM node:20-alpine AS frontend-build


# Set working directory
WORKDIR /app

COPY . .

# Inject environment variables (for React and Backend)

ARG REACT_APP_API_BASE_URL
ARG REACT_APP_IMAGE_HOST

ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_IMAGE_HOST=$REACT_APP_IMAGE_HOST


# Build the frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build





# Serve with Nginx
FROM socialengine/nginx-spa:latest

# Copy built frontend to Nginx web server directory
COPY --from=frontend-build /app/frontend/build /app

# Change root folder's permission
RUN chmod -R 777 /app