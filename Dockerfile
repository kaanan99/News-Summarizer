FROM node:20-alpine

COPY . .

WORKDIR /news-summarizer

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]