#!/bin/sh

# 删除前一天导出的数据
rm -rf /data/mongodb_backup

DIR=`date +%Y%m%d%H%M`
OUT=/data/mongodb_backup/$DIR
mkdir -p $DEST

# 全量导出MongoDB数据(排除部分集合)
mongodump --host "rs0/192.168.59.11:27017,192.168.59.12:27017,192.168.59.13:27017" \
          --db fundebug-production \
          --excludeCollection events \
          --out $OUT
