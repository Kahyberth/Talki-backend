# Dependencies stage
FROM node:21-alpine3.19 as deps

WORKDIR /usr/src/app


COPY package.json ./
COPY package-lock.json ./

RUN npm install


#Builder stage
FROM node:21-alpine3.19 as build


ARG LIVEKIT_API_KEY
ARG LIVEKIT_API_SECRET
ARG LIVEKIT_SERVER_URL
ARG API_URL
ARG TURSO_DATABASE_URL
ARG TURSO_AUTH_TOKEN
ARG DATABASE_URL
ARG PORT
ARG ORIGIN_CORS

ENV LIVEKIT_API_KEY=${LIVEKIT_API_KEY}
ENV LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET}
ENV LIVEKIT_SERVER_URL=${LIVEKIT_SERVER_URL}
ENV API_URL=${API_URL}
ENV TURSO_DATABASE_URL=${TURSO_DATABASE_URL}
ENV TURSO_AUTH_TOKEN=${TURSO_AUTH_TOKEN}
ENV DATABASE_URL=${DATABASE_URL}
ENV PORT=${PORT}
ENV ORIGIN_CORS=${ORIGIN_CORS}


WORKDIR /usr/src/app

COPY  --from=deps /usr/src/app/node_modules ./node_modules 


COPY . .
RUN npm run build

RUN npx drizzle-kit generate



#Production stage
FROM node:21-alpine3.19 as prod

WORKDIR /usr/src/app


COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/drizzle ./drizzle


ENV NODE_ENV=production

USER node

EXPOSE 4000

CMD ["node", "dist/main.js"]