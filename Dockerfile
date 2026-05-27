# Stage 1: Build and prune dependencies
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN npm install
COPY . .
RUN npm run build --prefix frontend
RUN npm prune --production

# Stage 2: Production server
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend/dist ./frontend/dist
# Also need root package.json for module resolution
COPY --from=build /app/package.json ./package.json

ENV PORT 8080
ENV GOOGLE_CLOUD_LOCATION "us-central1"
ENV GOOGLE_CLOUD_PROJECT "game-496705"
ENV SECRET_KEY "UggVZJaWPS9NhJ3g8Rc0B8aIuc0wNHSj"
ENV PROXY_HEADER "GQuAmydFyuqfW_xCJbzuE54c2jLoIiak"
EXPOSE 8080

CMD ["node", "backend/server.js"]
