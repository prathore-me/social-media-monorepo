# Stage 1 : builder
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json nx.json tsconfig.base.json /usr/src/app/

RUN npm ci

COPY . /usr/src/app/

RUN npx nx build web-app --prod


# Stage 2 : production
FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html

COPY --from=builder /usr/src/app/dist/apps/web-app /usr/share/nginx/html

COPY apps/web-app/nginx.conf /etc/nginx/conf.d/default.conf

COPY apps/web-app/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]


# Development stage (for local dev with hot-reload)
FROM node:22-alpine AS development

WORKDIR /usr/src/app

ARG VITE_AUTH_API_URL

ARG VITE_USERS_API_URL

ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL

ENV VITE_USERS_API_URL=$VITE_USERS_API_URL

COPY package.json package-lock.json nx.json tsconfig.base.json /usr/src/app/

RUN npm ci

COPY . /usr/src/app/

EXPOSE 5173

CMD ["sh", "-c", "npx nx run web-app:dev --host 0.0.0.0 --port 5173"]
