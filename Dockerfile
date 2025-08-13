# 1️⃣ Base image for building
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Accept environment variables at build time (optional override if not using .env.local)
ARG MONGO_URI
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BASE_URL_API
ARG NEXT_PUBLIC_ADMIN_EMAIL
ARG NEXT_PUBLIC_ADMIN_PASSWORD
ARG NEXT_PUBLIC_TOKEN

# Set environment variables so Next.js sees them during build
ENV MONGO_URI=$MONGO_URI
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL_API=$NEXT_PUBLIC_BASE_URL_API
ENV NEXT_PUBLIC_ADMIN_EMAIL=$NEXT_PUBLIC_ADMIN_EMAIL
ENV NEXT_PUBLIC_ADMIN_PASSWORD=$NEXT_PUBLIC_ADMIN_PASSWORD
ENV NEXT_PUBLIC_TOKEN=$NEXT_PUBLIC_TOKEN

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the project
COPY . .

# Ensure .env.local is copied into the container as .env (for Next.js build)
# This only matters if you're building locally with a .env.local file
RUN if [ -f .env.local ]; then cp .env.local .env; fi

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
