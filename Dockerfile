# Step 1: Build stage
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Run stage
FROM node:18
WORKDIR /app

COPY --from=builder /app ./

# Set production environment
ENV NODE_ENV=production

EXPOSE 8080
CMD ["npm", "start"]
