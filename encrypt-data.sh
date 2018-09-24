#!/bin/bash

DIR=`find /data/mongodb_backup/ -maxdepth 1 -type d ! -path /data/mongodb_backup/`
source=$DIR/fundebug-production
cd $source

# 将导出数据加密
for file in * ; do
    gpg --batch --yes -v -e -r fundebug --output $source/$file.gpg --always-trust $file
done ;