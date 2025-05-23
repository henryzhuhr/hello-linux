FROM ubuntu:24.04

# ============================================================
# 「基础」软件列表 BASE_INSTALL_LIST
#        - ubuntu-desktop-minimal   桌面环境（会比较大）
#        - ubuntu-server            服务器环境 (包含 openssh-server ?)
#        - ca-certificates          证书
#        - locales                  语言环境
#        - zsh                      shell
# ============================================================
ARG BASE_INSTALL_LIST="ubuntu-server"
ARG BASE_INSTALL_LIST="$BASE_INSTALL_LIST ca-certificates locales"
ARG BASE_INSTALL_LIST="$BASE_INSTALL_LIST zsh"

# ============================================================
# 「扩展」软件列表 EXTENT_INSTALL_LIST
#        - vim               编辑器 (ubuntu-server 包含 vi)
#        - tree              目录树
#        - pciutils          PCI 设备信息
#        - iputils-ping      ping 命令
#        - bash-completion   bash 补全 (zsh 取代了)
#        - dotenv            环境变量管理
#        - git               版本控制工具
#        - openssh-client    SSH 客户端 (ubuntu-server 不包含，所以如果使用 git clone 需要安装)
#        - build-essential   编译工具 (gcc g++ make)
# ============================================================
ARG EXTENT_INSTALL_LIST=""
ARG EXTENT_INSTALL_LIST="$EXTENT_INSTALL_LIST vim tree pciutils iputils-ping"
ARG EXTENT_INSTALL_LIST="$EXTENT_INSTALL_LIST git openssh-client"
ARG EXTENT_INSTALL_LIST="$EXTENT_INSTALL_LIST build-essential"

# 是否清理 apt 缓存
ARG CLEAN_APT_CACHE=1

# 自定义镜像源
# ARG MIRRORS_URL="mirrors.ustc.edu.cn"
ARG MIRRORS_URL="mirrors.tencentyun.com"
ENV DEBIAN_FRONTEND=noninteractive

# set -x 选项会使得每个命令在执行前都会被打印出来，报错时会显示是哪个命令出错
RUN set -x && \
    sed -i 's/#force_color_prompt=yes/force_color_prompt=yes/g' ${HOME}/.bashrc && \
    sed -i -e "s#//.*archive.ubuntu.com#//${MIRRORS_URL}#g" -e "s#//ports.ubuntu.com#//${MIRRORS_URL}#g" /etc/apt/sources.list.d/ubuntu.sources && \
    apt-get update && \
    apt-get upgrade -y && \
    # 合并软件列表合并
    INSTALL_LIST="$BASE_INSTALL_LIST $EXTENT_INSTALL_LIST" && \
    apt-get install -y --no-install-recommends ${INSTALL_LIST} && \
    apt-get autoremove -y && \
    # 清理 apt 缓存
    if [ $CLEAN_APT_CACHE -ne 1 ]; then { apt-get clean all; rm -rf /var/lib/apt/lists/*; } fi && \
    localedef -i zh_CN -c -f UTF-8 -A /usr/share/locale/locale.alias zh_CN.UTF-8 

ENV LANG=zh_CN.utf8

# 系统时间错误可能导致: `tls: failed to verify certificate: x509: certificate signed by unknown authority`
# 修改时区 (date -R 检查当前时间)
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 启用 bash 补全
# RUN sed -i.bak '/^#if ! shopt -oq posix; then$/,/^#fi$/s/^#//' /etc/bash.bashrc

# 设置 zsh 为默认 shell
RUN set -x && \
    chsh -s /usr/bin/zsh && \
    git clone https://mirrors.tuna.tsinghua.edu.cn/git/ohmyzsh.git --depth 1 && \
    cd ohmyzsh/tools && \
    REMOTE=https://mirrors.tuna.tsinghua.edu.cn/git/ohmyzsh.git sh install.sh && \
    # git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-/root/.oh-my-zsh/custom}/plugins/zsh-autosuggestions && \
    # 使用 gitee 同步仓库
    git clone https://gitee.com/henryzhuhr/zsh-autosuggestions.git ${ZSH_CUSTOM:-/root/.oh-my-zsh/custom}/plugins/zsh-autosuggestions && \
    echo "ZSH_THEME='candy'" >> ~/.zshrc && \
    echo "plugins=(macos dotenv git cp python bundler rake rbenv ruby zsh-autosuggestions)" >> ~/.zshrc && \
    echo "ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=#00BFFF,bg=gray,bold,underline'" >> ~/.zshrc && \
    echo "ZSH_AUTOSUGGEST_STRATEGY=(history completion)" >> ~/.zshrc && \
    echo "source \$ZSH/oh-my-zsh.sh" >> ~/.zshrc && \
    echo "alias ll='ls -alh'" >> ~/.zshrc && \
    echo "alias la='ls -A'" >> ~/.zshrc && \
    echo "alias l='ls -CF'" >> ~/.zshrc && \
    echo "alias h='history'" >> ~/.zshrc && \
    echo "alias mkdir='mkdir -p'" >> ~/.zshrc && \
    echo "alias grep='grep --color=auto'" >> ~/.zshrc && \
    echo "alias egrep='egrep --color=auto'" >> ~/.zshrc && \
    echo "alias fgrep='fgrep --color=auto'" >> ~/.zshrc

ARG USER_NAME="root"
ARG USER_HOME="/${USER_NAME}"

# ============================================================
#   ⬇️ 扩展 Dockerfile
# ============================================================
