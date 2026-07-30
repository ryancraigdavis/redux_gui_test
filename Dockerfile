FROM node:26-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

RUN addgroup -S nodejs && adduser -S app -G nodejs && chown -R app:nodejs /app
USER app

EXPOSE 3000
CMD ["node", "src/server.js"]
