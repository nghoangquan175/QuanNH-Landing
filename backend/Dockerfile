ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-bookworm-slim AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

FROM base AS deps
# better-sqlite3 and sharp are native modules and need a toolchain to build.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-be,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
# Strapi refuses to build without these present — throwaway build-time values, never
# the running secrets, which arrive from the runtime environment.
ENV NODE_ENV=production \
    APP_KEYS=build,build,build,build \
    API_TOKEN_SALT=build \
    ADMIN_JWT_SECRET=build \
    TRANSFER_TOKEN_SALT=build \
    JWT_SECRET=build \
    ENCRYPTION_KEY=build
RUN pnpm build
# The admin is pre-built into dist/ — drop devDependencies so the image fits a small disk.
RUN CI=true pnpm prune --prod --ignore-scripts

FROM node:${NODE_VERSION}-bookworm-slim AS runner
ENV NODE_ENV=production \
    DATABASE_CLIENT=sqlite \
    DATABASE_FILENAME=.tmp/data.db
WORKDIR /app
RUN groupadd -r strapi && useradd -r -m -g strapi strapi
ENV HOME=/home/strapi

COPY --from=build --chown=strapi:strapi /app ./

# SQLite database and uploaded media both live on volumes — without them a container
# rebuild wipes all content.
RUN mkdir -p /app/.tmp /app/public/uploads && chown -R strapi:strapi /app/.tmp /app/public
VOLUME ["/app/.tmp", "/app/public/uploads"]

USER strapi
EXPOSE 1337
CMD ["node", "node_modules/@strapi/strapi/bin/strapi.js", "start"]
