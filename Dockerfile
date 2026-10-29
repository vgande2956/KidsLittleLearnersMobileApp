FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY www/ ./www/
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/www/ /usr/share/nginx/html/

RUN printf 'server {\n\
  listen ${PORT};\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location = /health { access_log off; return 200 \"ok\\n\"; add_header Content-Type text/plain; }\n\
  location /api/auth/ {\n\
    proxy_pass https://kidslearningapp-94co.onrender.com;\n\
    proxy_ssl_server_name on;\n\
    proxy_set_header Host kidslearningapp-94co.onrender.com;\n\
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
    proxy_set_header X-Forwarded-Proto https;\n\
  }\n\
  location / { try_files $uri $uri/ /index.html; }\n\
}\n' > /etc/nginx/templates/default.conf.template

ENV PORT=10000
EXPOSE 10000
