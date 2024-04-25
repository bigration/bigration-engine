FROM node:20-alpine
WORKDIR /app
COPY dist/apps/bigration-engine ./

ENV NODE_ENV=production

COPY deployment/bigration-engine/healthcheck.js ./
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD node healthcheck.js

USER node

CMD ["main.js"]

