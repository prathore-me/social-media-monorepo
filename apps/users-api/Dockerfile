# Stage 1 : builder
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json nx.json tsconfig.base.json /usr/src/app/

RUN npm ci

COPY . /usr/src/app/

RUN npx nx build users-api --prod


# Stage 2 : production
FROM node:22-slim AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules

COPY --from=builder /usr/src/app/dist/apps/users-api /usr/src/app/dist/apps/users-api

EXPOSE 3000

CMD ["node", "dist/apps/users-api/main.js"]


# Development stage (for local dev with hot-reload)
FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package.json package-lock.json nx.json tsconfig.base.json /usr/src/app/

RUN npm ci

COPY . /usr/src/app/

EXPOSE 3000

CMD ["sh", "-c", "npx nx serve users-api --host 0.0.0.0 --watch"]

