FROM nginx:alpine

COPY www/ /usr/share/nginx/html/

# Render provides $PORT; the nginx image templates /etc/nginx/templates at start
RUN printf 'server {\n  listen ${PORT};\n  root /usr/share/nginx/html;\n  index index.html;\n  location / { try_files $uri $uri/ /index.html; }\n}\n' > /etc/nginx/templates/default.conf.template

ENV PORT=10000
EXPOSE 10000
