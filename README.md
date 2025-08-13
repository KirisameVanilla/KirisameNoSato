# 雾雨之乡

> [雾雨之乡](https://vanillaaaa.org/)

## 项目简介

- 技术栈：Svelte、Vite、TypeScript

## 本地开发

1. 安装依赖：
   ```sh
   npm install
   ```
2. 启动开发服务器：
   ```sh
   npm run dev
   ```

## 构建与部署

创建文件 `/etc/nginx/sites-available/kirisame-nosato`：
``` nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/kirisame-nosato;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

然后启用站点:
``` bash
sudo ln -s /etc/nginx/sites-available/kirisame-nosato /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

使用 Nginx + Let's Encrypt 实现 HTTPS

安装 Certbot 和 nginx 插件
``` bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

使用 Certbot 申请并自动配置 HTTPS
``` bash
sudo certbot --nginx -d example.com -d www.example.com
```

执行过程中会提示：

- 输入邮箱（用于安全通知）
- 是否同意 Let's Encrypt 协议
- 是否将 HTTP 自动重定向到 HTTPS（选 yes）
设置自动续期（Let's Encrypt 证书有效期 90 天）

Certbot 会自动添加一个定时任务（通过 cron 或 systemd timer），但你可以手动测试：

``` bash
sudo certbot renew --dry-run
```
如果无报错，说明自动续期已配置成功

## 目录结构

- `src/`：源代码目录
- `build/`：构建输出目录
- `static/`：静态资源
