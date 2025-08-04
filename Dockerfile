FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN ls -la dist/

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
RUN ls -la /usr/share/nginx/html/
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 