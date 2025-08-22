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

### Cloudflare 托管

使用 Cloudflare Page 托管部署，部署指令`npm run build`，输出目录`build`

### 自部署

[SvelteKit 项目生产环境部署指南](https://vanillaaaa.org/blogs/DeployGuide)

## 目录结构

- `src/`：源代码目录
- `build/`：构建输出目录
- `static/`：静态资源

## 致谢

- [Cloudfare](https://developers.cloudflare.com/)<br>For CI/CD
- [gitattributes](https://github.com/gitattributes/gitattributes)<br>For gitattributes file
- [Svelte](https://svelte.dev/)<br>For web app framework
