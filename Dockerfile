# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copia arquivos de dependências e instala
COPY package.json package-lock.json* ./
RUN npm install

# Copia todo o restante do código e compila o TypeScript
COPY . .
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]