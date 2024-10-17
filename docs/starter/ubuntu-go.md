---
outline: deep
---

<!-- https://zq99299.github.io/linux-tutorial/ -->

# Ubuntu Go

> [!TIP]
> - 一些 Ubuntu 使用小技巧，同样适用于其他 Linux 发行版本。
> - 对于 💻 MacOS 来说，很多操作都是一样的，但是请不要随便修改 Mac 下的用户权限，也不要随意操作 sudo ，否则就得跑一趟 Apple Store 了，如果这种不幸真的发生了，请从 [Apple 支持](https://getsupport.apple.com/products) 预约 [Genius Bar 天才吧](https://www.apple.com.cn/retail/geniusbar/) 的天才们吧

【目录导航】
- [📥 软件包管理](#software-package-management)
- [🛠️ 常用脚本](#useful-scripts)

## 📥 软件包管理

<span id="software-package-management" />

### 不同系统的软件包管理

| Linux 发行版本        | 软件包管理器 | 安装软件包命令                  |
| --------------------- | ------------ | ------------------------------- |
| **Debian/Ubuntu**     | `apt`        | `sudo apt install <package>`    |
| **Ubuntu** (夹带私货) | `snap`       | `snap install <package>`        |
| **CentOS/RHEL**       | `yum`        | `sudo yum install <package>`    |
| **Fedora**            | `dnf`        | `sudo dnf install <package>`    |
| **Arch**              | `pacman`     | `sudo pacman -S <package>`      |
| **SUSE**              | `zypper`     | `sudo zypper install <package>` |

### Ubuntu apt

`apt` 是 Ubuntu 的软件包管理器，用于安装、升级和删除软件包。

`apt` 是 `apt-get` 和 `apt-cache` 的组合，提供了更多的功能和选项。



## 🏖️ 环境变量

### 如何查看环境变量

查看环境变量有三个命令：

- `env`: 列出所有的环境变量
- `export`: 列出所有的环境变量，但 export 可以指定列出某一环境变量
- `echo $PATH`: 列出指定变量，例如列出变量 `PATH` 的值，里面包含了已添加的目录。

有一些十分有用的环境变量，例如
- `USER`: 当前登陆用户，例如 `ubuntu`。
- `HOME`: 当前登陆用户的用户目录，例如等价于 `/home/ubuntu`。
- `PWD`: 当前工作目录

### 设置环境变量

以下两条命令效果一样的，区别在于系统查找路径的顺序。添加路径后，可以运行 `echo $PATH` 查看路径
```shell
export PATH=$PATH:/path/to/your/dir       # 加到 PATH 末尾
export PATH=/path/to/your/dir:$PATH       # 加到 PATH 开头
```
> 注意，如果「添加」环境变量，一定要把当前的环境变量也添加进去 (也就是 `$PATH`)，再加上新的路径 `/path/to/your/dir`，并用 `:` 分割，否则会导致原来的环境变量失效。

例如 `PATH` 中包含了两个 python 路径：
```shell
$ echo $PATH
/usr/bin/python:/home/ubuntu/miniconda3/bin/python
```
那么这时候，运行 python 先找到系统的 `/usr/bin/python`

同时，也可以新建变量供其他程序使用，例如设置 `OpenCV_DIR` 供 CMake 编译查找使用
```shell
OpenCV_HOME=$HOME/program/opencv-4.5.5
export OpenCV_DIR=$OpenCV_HOME/lib/cmake/opencv4
```





### 环境变量的作用域

- **终端作用域**

在当前终端下，直接添加环境变量，只对当前终端生效，退出终端后失效
```shell
export JAVA_HOME=$HOME/program/jdk-17.0.2.jdk/Contents/Home
```

- **当前用户作用域** <span id="env-var-for-user"></span>

编辑用户目录下的 `~/.bashrc` 文件，仅对当前用户有效
```shell
vim ~/.bashrc
```
添加环境变量
```shell
export JAVA_HOME=$HOME/program/jdk-17.0.2.jdk/Contents/Home
```
然后重启终端或者运行命令激活：
```shell
source ~/.bashrc
```

> - `~` 与 `$HOME` 变量的值一致，表示当前用户目录
> - `.bashrc` 文件指的是 bash 的配置文件，如果系统使用的是其他 shell ，例如使用 zsh 应该修改 `.zshrc` 

- **全部用户作用域**

编辑系统目录下的 `/etc/profile` 文件，流程和一致[当前用户作用域](#env-var-for-user)，只是作用范围不一样

### 特殊环境变量 PATH/LD_LIBRARY_PATH/LIBRARY_PATH

Linux 系统中有三个特殊的环境变量，分别是 `PATH`、`LD_LIBRARY_PATH` 和 `LIBRARY_PATH`，它们的作用分别是：
- `PATH`：指定可执行程序的查找路径，通常指向 `bin` 目录
- `LD_LIBRARY_PATH`：指定动态链接库的查找路径，通常指向 `lib`/`bin` 目录，取决于库的开发者如何组织自己的库目录
- `LIBRARY_PATH`：指定静态链接库的查找路径，通常指向 `lib` 目录

例如对于 CUDA，添加如下环境变量后就可以执行 `nvcc` 命令
```shell
export PATH=$PATH:/usr/local/cuda-12.0/bin
```
添加如下环境变量后就可以编译 CUDA 程序，并在运行时查找到对应的动态链接库
```shell
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH/usr/local/cuda-12.0/lib64
```


### 刷新环境变量

通常会使用 `source ~/.bashrc` 来刷新环境变量，但是这种方法实际上是拼接或添加 (append) 环境变量

如果希望真正刷新 (reload/refresh) ，应该使用 `exec -l $shell` 以新的进程登录当前shell （替换当前进程），意味着重新读取shell profile，在读取的过程中仍然是执行了完整的shell profile 。其中，`$shell` 是当前 shell 的路径，例如 `/bin/bash` 或者 `/bin/zsh` 等等。

> [校招中的“熟悉linux操作系统”一般是指达到什么程度？ - BppleMan的回答 - 知乎](https://www.zhihu.com/question/517101428/answer/3042299744)

### 个人定义的非常有用的环境变量

#### 关于深度学习的环境变量

这一段代码可以放在 `~/.bashrc` 中，用于设置 CUDA、cuDNN 和 TensorRT 的环境变量。需要自行根据自己的版本修改：
- `CUDA_VERSION`：CUDA 的版本
- `CUDNN_HOME`：cuDNN 的路径
- `TENSORRT_HOME`：TensorRT 的路径

```shell
if [ "$(uname)" = "Linux" ]; then
    # ------ CUDA ------
    export CUDA_VERSION=11.8
    export CUDA_HOME=/usr/local/cuda-${CUDA_VERSION}
    export PATH=$PATH:$CUDA_HOME/bin
    export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$CUDA_HOME/lib64
    export CPATH=${CUDA_HOME}/targets/include:$CPATH
    export CPATH=${CUDA_HOME}/targets/x86_64-linux/include:$CPATH
    export CPATH=/usr/include/x86_64-linux-gnu/NvInfer.h:$CPATH

    # ------ cuDNN ------
    export CUDNN_HOME=$HOME/program/cudnn-linux-x86_64-8.9.0.131_cuda11-archive
    export CUDNN_LIBRARY=$CUDNN_HOME/lib
    export CUDNN_INCLUDE_DIR=$CUDNN_HOME/include
    export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$CUDNN_LIBRARY
    # export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$CUDNN_HOME/lib64

    # ------ TensorRT ------
    export TENSORRT_HOME=$HOME/program/TensorRT-8.6.1.6
    export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$TENSORRT_HOME/lib
    export PATH=$PATH:$TENSORRT_HOME/bin
fi
```
其中，`if [ "$(uname)" = "Linux" ];` 是为了判断是不是 MacOS ，因此这段代码完全可以放在 MacOS 的 `~/.zshrc` 中，只是 MacOS 下没有 CUDA 和 cuDNN 环境变量。这么做是为了能在不同 MacOS/Linux 下使用同一份配置文件。

在 CUDA 大版本不出现重大变化的情况下，以上的环境配置应该总是有效的；但是对于 cuDNN 和 TensorRT，由于版本更新较快，需要根据自己的版本进行修改。

## 🧑🏻‍💻 用户和用户组

### 新增用户

当我们需要在系统中添加用户🧑🏻‍💻时，可以通过下面的命令快速添加(记得修改 `USERNAME` 变量)
```shell
USERNAME=test   # change this variable for user
sudo useradd -s /usr/bin/bash -m ${USERNAME}
```
然后执行命令 `passwd` 修改密码
```shell
sudo passwd ${USERNAME}
```

`useradd` 命令还有其他一些参数可以进一步控制新增用户
```shell
useradd [-u UID] [-g GROUP] [-G GROUP] [-d DIR] [-mM] \
  [-c "comment"] [-r] [-s SHELL] [-e YYYY-MM-DD] [-f INACTIVE] \
  <USERNAME>
```

- `-u`: 指定用户的 UID，一般不要小于 500
- `-d`: 指定用户的主目录(绝对路径)，例如 `/home/userA`
- `-g`: 指定用户的初始组名。一般以和用户名相同的组作为用户的初始组，在创建用户时会默认建立初始组
- `-G`: 指定用户的附加组。我们把用户加入其他组，一般都使用附加组
- `-s`: 指定用户的登录 Shell，默认为 `-s /bin/bash`
- `-m`: 建立用户时强制建立用户目录。在建立系统用户时，该选项是默认的；
- `-e`: 指定用户的失效日期，格式为 `-e YYYY-MM-DD`。也就是 `/etc/shadow` 文件的第八个字段；
- `-f`: 指定用户的失效时长，经过 `INACTIVE` 天后该账户失效
- `-r`: 创建系统用户，也就是 UID 在 1~499 之间，供系统程序使用的用户。由于系统用户主要用于运行系统所需服务的权限配置，因此系统用户的创建默认不会创建主目录

实际上，可以简单通过 `useradd <USERNAME>` 来创建用户，并且会使用默认配置。默认配置存储在文件 `/etc/default/useradd` 中，可以通过命令 `useradd -D` 查看或直接查看该文件
```shell
$ useradd -D
GROUP=100             # 默认用户组，即 users
HOME=/home            # 默认在该目录下创建用户目录
INACTIVE=-1           # 密码失效日(天数)，`/etc/shadow` 的第七个字段，-1 表示永远不会失效
EXPIRE=               # 账户失效日(日期)，`/etc/shadow` 的第八个字段
SHELL=/bin/sh         # 用户默认使用的 shell
SKEL=/etc/skel        # 创建用户目录的参考目录
CREATE_MAIL_SPOOL=no  # 是否为使用者建立邮箱
```

使用命令 `useradd -D [options] <param>` 可以修改配置文件(`<param>` 需要自行修改)
```shell
useradd -D -b <HOME>
useradd -D -e <EXPIRE>  
useradd -D -f <INACTIVE>
useradd -D -g <GROUP>
# 例如修改默认 shell
useradd -D -s /bin/bash
```


## Dotfiles


Dotfiles 指的是以 `.` 开头的文件或者目录，例如 `.bashrc`、`.zshrc`、`.vimrc` 等等。这些文件通常存放在用户目录下，例如 `/home/ubuntu/.bashrc`。当然了，Windows下也有类似的文件，例如 `C:\Users\<your_name>\.ssh`。

这些文件通常用来存放「用户的配置信息」，例如 `~/.bashrc`/`~/.zshrc` 用来存放 bash/zsh 的配置信息。

这些文件通常是隐藏的，需要通过 `ls -a` 命令才能看到，或者在文件管理器中，解除隐藏。mac 下可以 `command+shift+.` 显示/隐藏 Dotfiles。

[Dotfiles – What is a Dotfile and How to Create it in Mac and Linux](https://www.freecodecamp.org/news/dotfiles-what-is-a-dot-file-and-how-to-create-it-in-mac-and-linux/)

---

<span id="sync-zshrc-to-icloud"></span>

✅ 这里有一个针对 MacOS 的实用技巧，通过云端同步 Dotfiles，以 iCloud 为例（请阅读以下完之后再进行操作）：

当前用户下的 iCloud 的路径为 `"$HOME/Library/Mobile Documents/com~apple~CloudDocs"` （iCloud 的路径有空格，需要加引号）

- **创建 iCloud 的`.zshrc` 文件**


如果 iCloud 中没有 `.zshrc` 文件，可以通过下面的命令将本地的 Dotfiles 复制到 iCloud 中

```zsh
cp -r ~/.zshrc "$HOME/Library/Mobile Documents/com~apple~CloudDocs/.zshrc"
```

这样，`.zshrc` 就存储在了 iCloud 中，可以在其他设备上同步。

- **从 iCloud 同步 `.zshrc` 文件至本地**

当拥有了一个新设备，只需要将本地的 `~/.zshrc` 删除，并且新建一个软连接，将本地的 `~/.zshrc` 指向 iCloud 中的 `~/.zshrc`，这样就可以实现多个设备中开发环境的同步了。

```zsh
mv ~/.zshrc ~/.zshrc.bak # 备份本地默认的 .zshrc 防止丢失
ln -s "$HOME/Library/Mobile Documents/com~apple~CloudDocs/.zshrc" ~/.zshrc
```

- **新建 ICLOUD 变量**

为了方便，在 `~/.zshrc` 中添加一个环境变量 `ICLOUD`，指向 iCloud 的路径，便于快速使用，而不需要记住长长的路径
```zsh
export ICLOUD="$HOME/Library/Mobile Documents/com~apple~CloudDocs"
```

上述的方法同样可以用于其他云端存储，例如 Dropbox、OneDrive

## 后台运行
https://zhuanlan.zhihu.com/p/344554760

### 定时任务

linux 内置的 cron 进程能定时运行任务。`crontab` 命令是 cron table 的简写，它是 cron 的配置文件，也可以叫它作业列表。

相关配置文件在如下位置：
- `/var/spool/cron/` 目录下存放的是每个用户包括 root 的 crontab任务，每个任务以创建者的名字命名
- `/etc/crontab` 这个文件负责调度各种管理和维护任务。
- `/etc/cron.d/` 这个目录用来存放任何要执行的crontab文件或脚本。
-  我们还可以把脚本放在 `/etc/cron.hourly` , `/etc/cron.daily` , `/etc/cron.weekly` , `/etc/cron.monthly` 目录中，让它每小时/天/星期、月执行一次。

`crontab` 命令如下：
```sh
crontab [-u username]　　　　//省略用户表表示操作当前用户的crontab
    -e      (编辑工作表)
    -l      (列出工作表里的命令)
    -r      (删除工作作)
```


我们用 `crontab -e` 进入当前用户的工作表编辑，是常见的 vim 界面。每行是一条命令。

`crontab` 的命令构成为 `时间 + 动作`，其时间有分、时、日、月、周五种，操作符有
- `*` 取值范围内的所有数字
- `/` 每过多少个数字
- `-` 从X到Z
- `,` 散列数字

`m h dom mon dow command`


```sh
* * * * * command         # 每分钟执行一次 command
* 0 */1 * * * command     # 每分钟执行一次 command
3,15 * * * * command      # 每小时的第3和第15分钟执行
3,15 8-11 * * * command   # 在上午8点到11点的第3和第15分钟执行
3,15 8-11 */2 * * command # 每隔两天的上午8点到11点的第3和第15分钟执行
3,15 8-11 * * 1 command   # 每周一上午8点到11点的第3和第15分钟执行
30 21 * * * /etc/init.d/smb restart   # 每晚的21:30重启smb
10 1 * * 6,0 /etc/init.d/smb restart  # 每周六、周日的1 : 10重启smb
0 23 * * 6 /etc/init.d/smb restart    # 每星期六的晚上11 : 00 pm重启smb
```

| 特殊字符    | 含义                       |
| ----------- | -------------------------- |
| `@reboot`   | 在每次启动时运行一次       |
| `@yearly`   | 每年运行一次 `0 0 1 1 *`   |
| `@annually` | 与@yearly用法一致          |
| `@monthly`  | 每月运行一次 `0 0 1 * *`   |
| `@weekly`   | 每周运行一次 `0 0 * * 0`   |
| `@daily`    | 每天运行一次 `0 0 * * *`   |
| `@midnight` | 与 `@daily` 用法一致       |
| `@hourly`   | 每小时运行一次 `0 * * * *` |


## 💾 磁盘

### 查看磁盘空间

```sh
df -h /home/zhr
```


查看当前或者指定目录占用空间，并可以指定查询子目录深度（否则就递归查看全部文件），`-h` 则以 `K M G` 为单位进行显示
```sh
du -h
du --max-depth=1 -h
du --max-depth=1 -h /home
```


## 📁 共享文件夹

### samba 方案
安装
```sh
sudo apt install -y samba openssh-server
```

samba 的配置文件在 `/etc/samba/smb.conf` ，在编辑之前先备份配置文件
```
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.bak
sudo nano /etc/samba/smb.conf
```

修改完后重启 samba 服务
```sh
sudo service restart smbd
sudo service restart nmbd
# 或者
sudo /etc/init.d/smbd restart
sudo /etc/init.d/nmbd restart
```

不知道从什么时候开始用户不再能使用系统本地帐号登录了，必须要有个 samba 帐号才行。所以要为系统用户新增 samba 帐号，比如，已经有一个用户叫 `user1`，现在给 `user1` 开通 samba 帐号：
```sh
sudo smbpasswd -a user1 # add 添加用户
sudo smbpasswd -e user1 # enable 激活用户
sudo smbpasswd -d user1 # disable 禁用用户
sudo smbpasswd -x user1 # 删除用户
```

列出 samba 用户列表，读取 `passdb.tdb` 数据库文件
```sh
sudo pdbedit -L  
sudo pdbedit -Lv # 详细信息
```


添加共享目录参数格式如下
```
[datasets]  # 共享名称
   comment = Do not  arbitrarily modify the datasets
   path = /opt/datasets     # 共享路径
   browseable = yes         # 是否在网上邻居可见，可被其他人看到资源名称（非内容）
   valid users = test1,@bob # [可选] @+组名 表示可以加入一个组访问权限
   invalid users = test2    # [可选] 禁止访问该共享的用户
   read only = yes          # 只读权限，否则为 no
   create mask = 0664       # 新建文件的权限为 664
   directory mask = 0775    # 新建目录的权限为 775
   guest ok = no            # 是否所有人可查看，等效于 public = no
```

特殊的共享
```
[homes]
  comment = Home Directories
  browseable = no
  read only = no
  valid users = %S # %s  是指登陆用户可以访问 
  ; valid users = MYDOMAIN\%S
  create mask = 0755 #建议将权限修改成0755，这样其它用户只是不能修改
  directory mask = 0755
```

参考：https://www.cnblogs.com/reachos/p/8716415.html

## 🖋️ 文本编辑器

### nano
-   Ctrl+G，显示帮助文本
-   Ctrl+O，保存当前文件
-   Ctrl+R，读取其他文件并插入光标位置
-   Ctrl+Y，跳至上一屏幕
-   Ctrl+K，剪切当前一行
-   Ctrl+C，显示光标位置
-   Ctrl+X，退出编辑文本
-   Ctrl+J，对其当前段落（以空格为分隔符）
-   Ctrl+W，搜索文本位置
-   Ctrl+V，跳至下一屏幕
-   Ctrl+U，粘贴文本至光标处
-   Ctrl+T，运行拼写检查
-   Ctrl+_，跳转到某一行
-   ALT+U，撤销
-   ALT+E，重做
-   ALT+Y, 语法高亮
-   ALT+#，显示行号


## 运维

### 登陆提示信息

登录信息可以修改三个文件：

- `/etc/issue` 本地登陆显示的信息，本地登录前
- `/etc/issue.net` 网络登陆显示的信息，登录后显示，需要由sshd配置
- `/etc/motd` 常用于通告信息，如计划关机时间的警告等，登陆后的提示信息

`/etc/update-motd.d/` 目录下包含了登陆的提示信息

> 文件的第一行必须是 `#!/bin/sh` 或者 `#!/bin/bash` , 这是告诉系统要用相关的shell解析该文件

`sudo chmod 755 60-my-welcome-info`

Ubuntu的登陆和欢迎信息控制/etc/issue和/etc/motd。/etc/issue与/etc/motd区别在于：当一个网络用户或通过串口登录系统 上时,/etc/issue的文件内容显示在login提示符之前,而/etc/motd内容显示在用户成功登录系统之后。


Ubuntu 与别的 Linux 不同，直接修改 /etc/motd 文件重登录后无效。因为这里 /etc/motd 是一个符号链接，指向 /var/run/motd，应该是一个启动后在生成的文件。



使用ssh或console登陆成功后，ubuntu会顺序执行/etc/update-motd.d中的脚本

issue.net文件：
（只针对网络用户）--若通过远程本文设备（如通过ssh或telnet等）登录，则显示该文件的内容。使用ssh登录时，会不会显示issue信息由sshd服务的sshd_config的Banner属性配置决定；





<!-- 
在linux系统的环境下，不管是root用户还是其它的用户只有登陆系统后用进入操作我们都可以通过命令history来查看历史记录，可是假如一台服务器多人登陆，一天因为某人误操作了删除了重要的数据。这时候通过查看历史记录（命令：history）是没有什么意义了（因为history只针对登录用户下执行有效，即使root用户也无法得到其它用户histotry历史）。那有没有什么办法实现通过记录登陆后的IP地址和某用户名所操作的历史记录呢？答案：有的。

通过在/etc/profile里面加入以下代码就可以实现：


```sh
PS1="`whoami`@`hostname`:"'[$PWD]'

history
USER_IP=`who -u am i 2>/dev/null| awk '{print $NF}'|sed -e 's/[()]//g'`


if [ "$USER_IP" = "" ]
then
USER_IP=`hostname`
fi

if [ ! -d /tmp/dbasky ]
then
mkdir /tmp/dbasky
chmod 777 /tmp/dbasky
fi

if [ ! -d /tmp/dbasky/${LOGNAME} ]
then
mkdir /tmp/dbasky/${LOGNAME}
chmod 300 /tmp/dbasky/${LOGNAME}
fi
export HISTSIZE=4096
DT=`date "+%Y-%m-%d_%H:%M:%S"`
export HISTFILE="/tmp/dbasky/${LOGNAME}/${USER_IP} dbasky.$DT"
chmod 600 /tmp/dbasky/${LOGNAME}/*dbasky* 2>/dev/null
```


source /etc/profile 使用脚本生效

退出用户，重新登录

上面脚本在系统的/tmp新建个dbasky目录，记录所有登陆过系统的用户和IP地址（文件名），每当用户登录/退出会创建相应的文件，该文件保存这段用户登录时期内操作历史，可以用这个方法来监测系统的安全性。

root@zsc6:[/tmp/dbasky/root]ls 
10.1.80.47 dbasky.2013-10-24_12:53:08 
root@zsc6:[/tmp/dbasky/root]cat 10.1.80.47 dbasky.2013-10-24_12:53:08

查看在12:53:08从10.1.80.47登录的root用户操作命令历史


Linux - 查看用户登录记录: https://blog.csdn.net/m0_37470701/article/details/105950702 -->




## 🗃️ 文件系统

<!-- ext3，ext4，xfs和btrfs文件系统性能对比 -->

## 与服务器之间的文件传输
## scp

scp -c blowfish

试试这个，有惊喜。问题出在加密算法上，默认的加密算法最快也就那个水平，如果是内网传输，可以牺牲一下加密强度换速度。

[Linux 下两台服务器间如何全速传输文件？ - Zign的回答 - 知乎](https://www.zhihu.com/question/442008347/answer/1707333952)


切换算法

scp默认是使用AES-128加密算法加密数据传输,你可以根据安全和速度的具体需求使用参数-c(cipher)来换加密算法比如Blowfish或RC4。


scp -c blowfish some-file username@remotehost:~
scp -c arcfour some-file username@remotehost:~

RC4比Blowfish更快但安全性稍低，具体使用那个算法完全取决于你。你也可以使用Tripe-DES来增强安全

scp -c 3des some-file username@remotehost:~


压缩

你也可以使用参数-C(大写compress)来压缩后传输，但需要自己衡量因为压缩和解压都会给cpu增加负担，除非网络速度很低才考虑这种方式

scp -C some-file username@remotehost:~

https://eternalcenter.com/ssh-algorithms-ciphers-no-crypto-policies-rhel-8/

查看支持的加密算法 `man ssh_config`  `ssh -Q cipher`


chacha20-poly1305@openssh.com,aes128-ctr,aes192-ctr,aes256-ctr,aes128-gcm@openssh.com,aes256-gcm@openssh.com


aes128-ctr
aes192-ctr
aes256-ctr
aes128-gcm@openssh.com
aes256-gcm@openssh.com
chacha20-poly1305@openssh.com


## ftp 服务器搭建

```bash
sudo apt install -y vsftpd
```

vsftpd服务将在安装过程完成后自动启动。通过打印服务状态进行验证：

```bash
sudo systemctl status vsftpd
```

```bash
# 设置开机启动并启动ftp服务
systemctl enable vsftpd
systemctl start vsftpd
```

```bash
#查看其运行状态
systemctl  status vsftpd
#重启服务
systemctl  restart vsftpd
```


1.FTP访问

我们仅允许本地用户访问FTP服务器，找到anonymous_enable和local_enable指令，并验证您的配置是否与以下行匹配：

```bash
sudo vim /etc/vsftpd.conf
```

```bash
anonymous_enable=NO
local_enable=YES
```

2.启用上传

取消注释write_enable设置以允许对文件系统进行更改，例如上载和删除文件。

```bash
/etc/vsftpd.conf
```

```bash
write_enable=YES
```

被动FTP连接

https://www.cnblogs.com/sll0917/p/16557685.html

## 🛠️ 常用脚本

<span id="useful-scripts" /> 

### 颜色日志

::: details 点击查看代码
<<< ./scripts/color.sh
:::




## 待补充

<!-- awk 和 sed 的使用

刷新shell profile 最好使用exec-I$shell 而不是souce.zshrc

近年来很多发行版都已经用systemd，但还是有不少人吐槽不如init.d，这二者有什么区别


我面试的时候一般会先问一下常规的操作。比如SSH连到一个服务器上，然后查看CPU/内存/磁盘空间等。

比如虚拟内存的工作原理，页表，交换空间等等。

还会考察候选人是否知道用什么样的命令或者系统API去查询这些东西的状态。

还可以问进程调度、文件系统等等。有时间还可以问一下网络相关的知识，不过校招一般不重视这块。社招有单独的网络面试。

如果上述这些都能回答得很好，并且还有时间的话，就可以聊一些高级话题。比如eBPF, btrfs，selinux，等。不过即便是社招，能走到这一步的人也屈指可数。 -->