# ----------- Builder Stage -----------
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy only what's needed for npm install
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Install only production dependencies and generate client
RUN npm ci --omit=dev \
    && npx prisma generate \
    # Clean npm cache to reduce image size
    && npm cache clean --force

# Copy only the necessary source files
COPY src ./src

# ----------- Production Stage -----------
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Copy only what's needed to run the app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package.json ./
# Create an empty mock_sounds dir (will be mounted as volume)
RUN mkdir -p mock_sounds

EXPOSE 3000

CMD ["npm", "start"]
