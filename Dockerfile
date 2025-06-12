FROM node:18
RUN apt-get update && apt-get install -y openssh-server && mkdir /var/run/sshd
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 3000 2222
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
