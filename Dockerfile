FROM daocloud.io/library/ubuntu:14.04

MAINTAINER Fundebug <help@fundebug.com>

# 设置时区
RUN sh -c "echo 'Asia/Shanghai' > /etc/timezone" && \
    dpkg-reconfigure -f noninteractive tzdata


RUN echo '\n\
deb http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ trusty-security main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ trusty-updates main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ trusty-proposed main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ trusty-backports main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ trusty main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-security main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-updates main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-proposed main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ trusty-backports main restricted universe multiverse\n'\
> /etc/apt/sources.list

RUN sudo apt-get update && \
    sudo apt-get install -y wget

# 安装node v8.9.1
RUN wget https://npm.taobao.org/mirrors/node/v8.9.1/node-v8.9.1-linux-x64.tar.gz && \
    tar -C /usr/local --strip-components 1 -xzf node-v8.9.1-linux-x64.tar.gz && \
    rm node-v8.9.1-linux-x64.tar.gz 

WORKDIR /app

# 安装npm模块
ADD package.json /app/package.json
RUN npm install --production -d --registry=https://registry.npm.taobao.org

COPY . /app

CMD ["node", "/app/server.js"]
