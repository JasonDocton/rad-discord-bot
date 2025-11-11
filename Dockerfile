FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies (as root, needed for installation)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Change ownership to bun user
# The oven/bun image has a pre-created 'bun' user (UID 1000)
RUN chown -R bun:bun /app

# Switch to non-root user for runtime
USER bun

# Run the bot
CMD ["bun", "run", "start"]
