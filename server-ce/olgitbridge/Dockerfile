FROM node:lts-slim

WORKDIR /var/olgitbridge/
ADD . .
RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list && sed -i 's|security.debian.org/debian-security|mirrors.ustc.edu.cn/debian-security|g' /etc/apt/sources.list
RUN apt-get update && apt-get upgrade -y && apt-get install --no-install-recommends git ca-certificates -y && apt-get clean
RUN npm install
RUN git config --global user.email "overleaf-git-bridge@system.changeme.invalid" && git config --global user.name "Overleaf Git Bridge"
RUN mkdir -p /var/olgitbridge/data

EXPOSE 5000
ENTRYPOINT [ "node", "src/server.js" ]