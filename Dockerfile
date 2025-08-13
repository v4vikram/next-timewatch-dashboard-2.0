# 1️⃣ Base image for building
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the project
COPY . .

# Build the Next.js app
RUN npm run build

# 2️⃣ Production runtime image
FROM node:20-alpine AS runner
WORKDIR /app

# Reduce image size
ENV NODE_ENV=production
ENV PORT=8080

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose the port Cloud Run will use
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
