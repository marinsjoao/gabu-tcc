FROM node:18-alpine

WORKDIR /app

# Instala dependências do sistema necessárias para o Prisma
RUN apk add --no-cache openssl

# Copia os arquivos de dependência
COPY package*.json ./
COPY prisma ./prisma

# Instala dependências
RUN npm install

# Gera o Prisma Client
RUN npx prisma generate

# Copia o resto do código
COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]