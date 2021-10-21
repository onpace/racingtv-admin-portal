FROM node:alpine

COPY package.json .
RUN npm i

COPY public/ public/
COPY src/ src/
RUN npm run build

EXPOSE 3001

CMD ["node", "./build_api/api/"]