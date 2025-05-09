FROM node:18

# Instala o ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Cria diretório de trabalho
WORKDIR /app

# Copia os arquivos
COPY . .

# Instala dependências
RUN npm install

# Expõe porta
EXPOSE 3000

# Comando para iniciar o app
CMD ["npm", "start"]
