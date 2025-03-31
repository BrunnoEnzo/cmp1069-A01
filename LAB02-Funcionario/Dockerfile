# Usa a imagem oficial do Nginx
FROM nginx:latest

# Remove o HTML padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia seus arquivos HTML e JS para a pasta padrão do Nginx
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Expõe a porta padrão do Nginx
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
