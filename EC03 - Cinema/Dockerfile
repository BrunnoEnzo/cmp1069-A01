FROM nginx:alpine

# Define o diretório de trabalho
WORKDIR /usr/share/nginx/html

# Copia todos os arquivos do projeto para o container
COPY . .

# Expõe a porta 80 (porta padrão do Nginx)
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]