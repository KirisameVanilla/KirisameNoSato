---
title: "Svelte 项目生产环境部署指南"
date: "2025-08-18"
readTime: "8 分钟"
tags: ["Svelte", "部署", "Nginx", "Linux"]
---

<script>
import PostHeader from '$lib/PostHeader.svelte';
import CodeBlock from '$lib/CodeBlock.svelte';

const buildCommand = `npm run build`;

const nginxConfig = `server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # 网站根目录
    root /var/www/kirisame-nosato;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # 处理前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # 安全头设置
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}`;

const enableSite = `sudo ln -s /etc/nginx/sites-available/kirisame-nosato /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx`;

const certbot = `sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`;
</script>

<PostHeader {title} {date} {readTime} {tags} />

Svelte 是一个出色的全栈 Web 框架，但在生产环境中正确部署需要一些配置技巧。本文将详细介绍如何在 Linux 服务器上使用 Nginx 部署 Svelte 应用，并配置 HTTPS 证书。

## 构建准备

在部署之前，我们需要先在本地构建项目：

<CodeBlock code={buildCommand} language="bash" title="构建 Svelte 项目" />

> **提示**：构建完成后，所有静态文件都会生成在 `build/` 目录中。这就是我们需要上传到服务器的内容。


## 服务器环境搭建

### 基础环境要求

部署 Svelte 应用需要以下基础环境：

- **Linux 服务器**（推荐 Ubuntu 20.04+）
- **Nginx**：高性能的 Web 服务器
- **Node.js**（可选，仅在需要 SSR 时）
- **SSL 证书**（推荐使用 Let's Encrypt）

### Nginx 配置

创建 Nginx 配置文件来处理静态文件服务和前端路由：

<CodeBlock code={nginxConfig} language="nginx" title="Nginx 站点配置" />

#### 配置说明

上述配置包含了以下重要特性：

- **前端路由支持**：`try_files $uri $uri/ /index.html;` 确保 SPA 路由正常工作
- **静态资源优化**：为 CSS、JS、图片等设置长期缓存
- **Gzip 压缩**：自动压缩文本内容，减少传输大小
- **安全头设置**：添加常见的安全响应头

将上述配置保存为 `/etc/nginx/sites-available/kirisame-nosato`，然后启用站点：

<CodeBlock code={enableSite} language="bash" title="启用 Nginx 站点" />

### HTTPS 配置

使用 Let's Encrypt 免费 SSL 证书为网站启用 HTTPS，提供安全加密连接。

<CodeBlock code={certbot} language="bash" title="Let's Encrypt HTTPS 配置" />

> **小贴士**：Certbot 会自动修改 Nginx 配置，添加 SSL 相关设置并设置 HTTP 到 HTTPS 的重定向。


### 部署清单

按照以下步骤完成完整的部署流程：

**部署步骤**

1. 在本地运行 `npm run build` 构建项目。
2. 将 `build/` 目录上传到服务器，放在 `/var/www/kirisame-nosato/` 下并确认文件权限（例如 `chmod -R 755 /var/www/kirisame-nosato`）。
3. 在服务器上创建并配置 Nginx 站点配置文件。
4. 启用站点并重新加载 Nginx 配置：
5. 使用 Certbot 申请并配置 SSL 证书（Certbot 可自动更新 Nginx 配置以启用 HTTPS）：
6. 测试网站访问、HTTPS 是否生效以及是否有 HTTP 到 HTTPS 的重定向。


### 常见问题排查

**问题：404 错误**

如果刷新页面时出现 404 错误，检查 Nginx 配置中的 `try_files` 指令是否正确。

**解决方案**：确保 `try_files $uri $uri/ /index.html;` 配置正确。

**问题：静态资源加载失败**

如果 CSS、JS 文件加载失败，可能是路径或权限问题。

**解决方案**：检查文件权限 `chmod -R 755 /var/www/kirisame-nosato`


### 总结

通过以上配置，你的 SvelteKit 项目就可以在生产环境中稳定运行了。这个配置提供了：

- **高性能**：Nginx 提供快速的静态文件服务
- **SPA 支持**：正确处理前端路由
- **缓存优化**：静态资源长期缓存
- **安全连接**：自动 HTTPS 和证书续期

> **提示**：记得定期更新服务器和证书，保持系统安全性。你可以设置自动化部署脚本来简化未来的更新流程。
