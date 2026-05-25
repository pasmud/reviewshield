FROM node:20-alpine AS builder

WORKDIR /app

COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm ci

COPY server/ ./server/
RUN cd server && npm run build

COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm ci

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache python3 py3-pip && pip3 install semgrep

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY rules/ ./rules/
COPY fixtures/ ./fixtures/

EXPOSE 42000

ENV PORT=42000
ENV CUSTOM_RULES_PATH=./rules

CMD ["node", "server/dist/index.js"]
