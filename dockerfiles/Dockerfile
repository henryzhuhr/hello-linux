FROM ubuntu:latest

# 镜像源
ARG MIRRORS_URL="mirrors.ustc.edu.cn"
RUN sed -i -e "s#//.*archive.ubuntu.com#//${MIRRORS_URL}#g" -e "s#//ports.ubuntu.com#//${MIRRORS_URL}#g" /etc/apt/sources.list.d/ubuntu.sources

# 更新软件包
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y \
    ca-certificates locales \
    git \
    vim

# 清理 apt 缓存，减小镜像体积；如果需要继续使用 apt-get 命令，可以注释掉该行
# RUN rm -rf /var/lib/apt/lists/*

# 系统时间错误导致: `tls: failed to verify certificate: x509: certificate signed by unknown authority`
# 修改时区 (date -R 检查当前时间)
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# 设置语言 (locale -a 查看支持的语言)
# 如果没有 zh_CN.UTF-8 执行 locale-gen zh_CN.UTF-8 && dpkg-reconfigure locales && locale -a
RUN localedef -i zh_CN -c -f UTF-8 -A /usr/share/locale/locale.alias zh_CN.UTF-8
ENV LANG=zh_CN.UTF-8

# 启用终端颜色提示
RUN sed -i 's/#force_color_prompt=yes/force_color_prompt=yes/g' ${HOME}/.bashrc