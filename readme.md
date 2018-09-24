## Fundebug 是这样备份数据的

### 从服务器上传备份数据到阿里 OSS

#### 步骤

-   使用 mongodump 导出 mongodb 数据
-   使用 gpg 加密导出的数据
-   将加密数据上传到阿里云对象存储服务

#### 通过 crontab 定时执行

```
# 每天凌晨4点从服务器上传备份数据到阿里OSS
00 4 * * * /root/mongodb-backup/dump-data.sh && /root/mongodb-backup/encrypt-data.sh && docker restart mongodb-backup && sleep 1m && curl http://127.0.0.1:9160/upload
```

### 从阿里云 OSS 将备份数据下载到本地

#### 通过 crontab 定时执行

```
# 每周六12点从阿里云OSS将备份数据下载到本地
0 12 * * 6 curl http://127.0.0.1:9160/download
```
