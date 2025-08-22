---
title: "Gitea 代码托管平台部署指南"
description: "在 Linux 服务器上从零搭建 Gitea 代码管理平台的完整指南，包含 HTTPS 配置和 Nginx 反向代理。"
date: "2025-8-23"
readTime: "12 分钟"
tags: ["Gitea", "Git", "部署", "Nginx", "Linux"]
---

<script>
import PostHeader from '$lib/PostHeader.svelte';
import CodeBlock from '$lib/CodeBlock.svelte';

const createUser = `sudo useradd \\
   --system \\
   --shell /bin/bash \\
   --comment 'Git Related' \\
   --create-home \\
   --home /home/git \\
   git
usermod -aG sudo git`;

const setPassword = `passwd git`;

const createDirectories = `pwd
mkdir gitea
cd gitea`;

const downloadGitea = `wget -O gitea https://dl.gitea.com/gitea/1.21.1/gitea-1.21.1-linux-amd64
chmod +x gitea`;

const downloadService = `sudo wget https://raw.githubusercontent.com/go-gitea/gitea/master/contrib/systemd/gitea.service -P /etc/systemd/system/
sudo vim /etc/systemd/system/gitea.service`;

const serviceConfig = `WorkingDirectory=/home/git/gitea/
# If using Unix socket: tells systemd to create the /run/gitea folder, which will contain the gitea.sock file
# (manually creating /run/gitea doesn't work, because it would not persist across reboots)
#RuntimeDirectory=gitea
ExecStart=/home/git/gitea/gitea web --config /home/git/gitea/app.ini
Restart=always
Environment=USER=git HOME=/home/git GITEA_WORK_DIR=/home/git/gitea`;

const startService = `systemctl daemon-reload
systemctl enable --now gitea`;

const checkStatus = `systemctl status gitea`;

const installNginx = `sudo apt update
sudo apt install nginx`;

const createNginxConfig = `sudo vim /etc/nginx/sites-available/gitea`;

const nginxConfig = `server {
    listen 80;
    server_name git.yourdomain.org;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`;

const enableSite = `sudo ln -s /etc/nginx/sites-available/gitea /etc/nginx/sites-enabled/
sudo nginx -t`;

const restartNginx = `sudo systemctl restart nginx`;

const installCertbot = `sudo apt install certbot python3-certbot-nginx -y`;

const setupHttps = `sudo certbot --nginx -d git.yourdomain.org`;
</script>

<PostHeader {title} {date} {readTime} {tags} />

Gitea 是一个轻量级的自托管 Git 服务，提供了与 GitHub 类似的功能。本文将详细介绍如何在 Linux 服务器上从零搭建 Gitea 代码管理平台，并配置 Nginx 反向代理和 HTTPS 证书。

> **服务器推荐**：[雨云](https://www.rainyun.com/ODAxNTg5_)  
> **推广码**：ODAxNTg5

## 环境要求

在开始部署之前，确保你的服务器满足以下要求：

- **Linux 服务器**（推荐 Ubuntu 20.04+）
- **至少 1GB RAM**
- **Git 2.0+**
- **数据库**（可选，本指南使用 SQLite）
- **域名**（用于 HTTPS 配置）

## 1. 创建 Git 用户

为了安全和管理方便，我们首先创建一个专门用于管理 Git 相关服务的用户：

<CodeBlock code={createUser} language="bash" title="创建 git 用户" />

为新创建的 git 用户设置密码：

<CodeBlock code={setPassword} language="bash" title="设置 git 用户密码" />

> **安全提示**：建议使用强密码，并考虑配置 SSH 密钥认证以提高安全性。

## 2. 准备安装环境

切换到 git 用户并创建必要的目录结构：

<CodeBlock code={createDirectories} language="bash" title="创建目录结构" />

## 3. 下载 Gitea 可执行文件

从官方仓库下载最新版本的 Gitea 二进制文件：

<CodeBlock code={downloadGitea} language="bash" title="下载并设置可执行权限" />

> **版本说明**：本指南使用 1.21.1 版本，你可以访问 [Gitea 官网](https://gitea.io/) 获取最新版本信息。

## 4. 配置系统服务

为了让 Gitea 作为系统服务自动启动，我们需要下载并配置 systemd 服务文件：

<CodeBlock code={downloadService} language="bash" title="下载服务配置文件" />

编辑服务文件，找到以下字段并修改为：

<CodeBlock code={serviceConfig} language="conf" title="systemd 服务配置" />

#### 配置说明

- `WorkingDirectory`：设置 Gitea 的工作目录
- `ExecStart`：指定 Gitea 的启动命令和配置文件路径
- `Environment`：设置必要的环境变量

## 5. 启动 Gitea 服务

重新加载 systemd 配置并启动 Gitea 服务：

<CodeBlock code={startService} language="bash" title="启动 Gitea 服务" />

检查服务运行状态：

<CodeBlock code={checkStatus} language="bash" title="检查服务状态" />

如果一切正常，你应该能看到服务处于 `active (running)` 状态。

## 6. Web 界面初始化

现在可以通过浏览器访问 `http://your_ip:3000/` 进行初始化设置：

### 数据库配置
- **数据库类型**：选择 SQLite3
- **数据库文件路径**：`/home/git/gitea/data/gitea.db`

### 基本设置
- **站点标题**：设置你的 Git 服务名称
- **仓库根路径**：`/home/git/gitea-repositories`
- **Git LFS 根路径**：`/home/git/gitea/data/lfs`
- **以此用户身份运行**：git

### 管理员账户
创建第一个管理员账户，设置用户名、密码和邮箱。

> **重要提示**：初始化完成后，建议立即修改默认配置文件 `/home/git/gitea/app.ini` 中的相关安全设置。

## 7. 配置域名和 HTTPS（可选但推荐）

### DNS 配置

在 Cloudflare 或其他 DNS 提供商中添加 A 记录，将你的域名指向服务器 IP 地址。

### 安装 Nginx

<CodeBlock code={installNginx} language="bash" title="安装 Nginx" />

### 配置反向代理

创建 Nginx 配置文件：

<CodeBlock code={createNginxConfig} language="bash" title="创建 Nginx 配置" />

添加以下配置内容：

<CodeBlock code={nginxConfig} language="nginx" title="Nginx 反向代理配置" />

#### 配置解释

- **proxy_pass**：将请求转发到 Gitea 服务（端口 3000）
- **proxy_set_header**：设置必要的请求头，确保 Gitea 能正确识别原始请求信息
- **WebSocket 支持**：通过 `Upgrade` 和 `Connection` 头支持实时功能

### 启用站点配置

<CodeBlock code={enableSite} language="bash" title="启用 Nginx 站点" />

重启 Nginx 服务：

<CodeBlock code={restartNginx} language="bash" title="重启 Nginx" />

### 配置 HTTPS

安装 Let's Encrypt 客户端：

<CodeBlock code={installCertbot} language="bash" title="安装 Certbot" />

申请并配置 SSL 证书：

<CodeBlock code={setupHttps} language="bash" title="配置 HTTPS" />

按照提示完成以下步骤：
- 输入邮箱地址（用于安全通知）
- 同意 Let's Encrypt 服务条款
- 选择是否将 HTTP 流量重定向到 HTTPS

## 部署验证

完成所有配置后，执行以下验证步骤：

### 功能验证清单

1. **服务状态**：`systemctl status gitea` 显示服务正常运行
2. **Web 访问**：通过域名能正常访问 Gitea 界面
3. **HTTPS 证书**：浏览器显示安全连接图标
4. **Git 操作**：能够正常创建仓库、提交代码
5. **用户注册**：确认用户注册功能正常（如果启用）

### 常见问题排查

**问题：无法访问 Web 界面**

检查防火墙设置：
```bash
sudo ufw status
sudo ufw allow 3000/tcp  # 如果直接访问
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
```

**问题：Git 推送失败**

确保 SSH 密钥配置正确，或检查仓库权限设置。

**问题：502 Bad Gateway**

检查 Gitea 服务状态和 Nginx 配置文件语法。

## 高级配置建议

### 性能优化

在 `/home/git/gitea/app.ini` 中调整以下配置：

```ini
[server]
DISABLE_SSH = false
SSH_PORT = 22
LFS_START_SERVER = true

[database]
LOG_SQL = false

[indexer]
ISSUE_INDEXER_TYPE = bleve
REPO_INDEXER_ENABLED = true
```

### 安全加固

1. **定期备份**：设置自动备份数据库和仓库文件
2. **更新维护**：定期更新 Gitea 到最新版本
3. **访问限制**：配置 IP 白名单或 VPN 访问
4. **监控告警**：设置服务状态监控

## 总结

通过本指南，你已经成功部署了一个功能完整的 Gitea 代码托管平台。这个配置提供了：

- **完整的 Git 托管功能**：支持所有标准 Git 操作
- **Web 界面管理**：类似 GitHub 的用户体验
- **HTTPS 安全连接**：自动证书续期
- **反向代理优化**：提高访问性能和安全性

> **维护提醒**：建议设置定期备份任务，并关注 Gitea 官方的安全更新通知，及时更新到最新版本。

## 参考资料

- [Gitea 官方文档](https://docs.gitea.io/)
- [从零开始搭建 Gitea 代码管理平台](https://www.cnblogs.com/zzugyl/p/16666343.html)
- [Let's Encrypt 证书申请指南](https://letsencrypt.org/getting-started/)
