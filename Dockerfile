# Etapa 1: imagem base com FFmpeg
FROM jrottenberg/ffmpeg:4.4-alpine as ffmpeg

# Etapa 2: imagem com Node.js
FROM node:18-alpine

# Copia ffmpeg e ffprobe para o novo container
COPY --from=ffmpeg /usr/local/bin/ffmpeg /usr/local/bin/ffmpeg
COPY --from=ffmpeg /usr/local/bin/ffprobe /usr/local/bin/ffprobe

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Cria as pastas necessárias para uploads
RUN mkdir -p uploads converted

# Expõe a porta usada pelo app
EXPOSE 3000

# Comando para rodar o app
CMD ["node", "server.js"]
