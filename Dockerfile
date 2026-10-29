FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY www/ ./www/
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/www/ /usr/share/nginx/html/
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=10000
EXPOSE 10000
