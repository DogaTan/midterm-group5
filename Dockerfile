FROM node:18

WORKDIR /usr/src/app

# package.json & package-lock.json'ı al
COPY package*.json ./

# 1. npm registry ve retry ayarları
RUN npm config set registry https://registry.npmjs.org/ \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-factor 2 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

# 2. npm install'ı 3 deneme ile sarmala
RUN set -eux; \
    for i in 1 2 3; do \
      npm install --omit=dev && break || \
      (echo "npm install failed, retry #$i"; sleep 5); \
    done

# Uygulama kaynağını kopyala
COPY . .

# entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
