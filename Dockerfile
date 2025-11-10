# ===========================================================
# 🧱 ETAPA 1 - BUILD
# ===========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos essenciais para aproveitar cache
COPY package*.json ./
RUN npm install -g pnpm

# Instala dependências (sem devs depois)
RUN pnpm install

# Copia o restante do código-fonte
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Gera o Prisma Client e compila o TypeScript
RUN pnpm prisma generate
RUN pnpm build


# ===========================================================
# 🚀 ETAPA 2 - RUNTIME
# ===========================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Instala o ffmpeg (inclui ffprobe automaticamente)
RUN apk add --no-cache ffmpeg

# Copia apenas o necessário da build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

# Railway injeta as variáveis automaticamente
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
