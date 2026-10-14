FROM node:22-alpine
WORKDIR /app
COPY package.json server.mjs index.html PROTOCOL.md WOLFRAM.md ./
COPY public ./public
COPY src ./src
COPY lib ./lib
COPY schemas ./schemas
COPY receipts ./receipts
COPY docs ./docs
COPY wolfram ./wolfram
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node","server.mjs"]
