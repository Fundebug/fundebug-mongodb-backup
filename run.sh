# 构建mongodb-backup镜像
echo "\nbuild fundebug/mongodb-backup image..."
sudo docker build -t fundebug/mongodb-backup .


# 运行mongodb-backup容器
sudo docker rm -f mongodb-backup > /dev/null
echo "\nstart mongodb-backup container..."
sudo docker run -d \
                --net=host \
                --name=mongodb-backup \
                -v `pwd`/DATA:/app/DATA \
                -v /data/mongodb_backup:/data/mongodb_backup \
                fundebug/mongodb-backup > /dev/null

echo ""
