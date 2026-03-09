FROM node:20

WORKDIR /app

# Copia apenas os arquivos de dependências primeiro
COPY package*.json ./

# Instala TUDO
RUN npm install

# Agora copia o resto do projeto (incluindo a pasta prisma e prisma.config.ts)
COPY . .

EXPOSE 3000

CMD npx prisma generate && npx prisma migrate dev --name init && npm run dev