# Multi-stage build for optimized production image

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_SUPABASE_URL=https://soqainwuxopobrpwofpn.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcWFpbnd1eG9wb2JycHdvZnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzU3MzMsImV4cCI6MjA4NDY1MTczM30.znhzlELlRjU2PPUd6RlBu8xy3ONPh_tc0TRlq2qG0k4
ARG SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcWFpbnd1eG9wb2JycHdvZnBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA3NTczMywiZXhwIjoyMDg0NjUxNzMzfQ.GUHTHfP3A1vg-m-k_4fp8exTzba9alKRp1hymSd19HU
ARG STRIPE_SECRET_KEY=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
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QBEYKDKDJaukVa608I0rGhTE7jv1X61yTECsua9T3pjEVRY3Ig35p8DkpYAvxI72CksG0vYdzVKW7TuG1C7fIGM00YL4Yxt7H
ARG STRIPE_WEBHOOK_SECRET=whsec_placeholder

# Set environment variables for build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

# Install ffmpeg, python3, curl (required for yt-dlp and healthcheck)
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    py3-pip \
    curl \
    && pip3 install --no-cache-dir yt-dlp --break-system-packages \
    && yt-dlp --version \
    && echo "? yt-dlp installed successfully: $(yt-dlp --version)"

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Set runtime environment variables (IMPORTANT: These are needed for the app to work)
ENV NEXT_PUBLIC_SUPABASE_URL=https://soqainwuxopobrpwofpn.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcWFpbnd1eG9wb2JycHdvZnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzU3MzMsImV4cCI6MjA4NDY1MTczM30.znhzlELlRjU2PPUd6RlBu8xy3ONPh_tc0TRlq2qG0k4
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcWFpbnd1eG9wb2JycHdvZnBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA3NTczMywiZXhwIjoyMDg0NjUxNzMzfQ.GUHTHfP3A1vg-m-k_4fp8exTzba9alKRp1hymSd19HU
ENV STRIPE_SECRET_KEY=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
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51QBEYKDKDJaukVa608I0rGhTE7jv1X61yTECsua9T3pjEVRY3Ig35p8DkpYAvxI72CksG0vYdzVKW7TuG1C7fIGM00YL4Yxt7H
ENV STRIPE_WEBHOOK_SECRET=whsec_placeholder

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create temp directory for processing
RUN mkdir -p /app/temp && chown -R nextjs:nodejs /app/temp

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Set environment variables
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Health check to ensure the application is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3001/ || exit 1

# Start the application
CMD ["node", "server.js"]
