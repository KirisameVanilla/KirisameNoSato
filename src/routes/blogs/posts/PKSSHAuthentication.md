---
title: "Linux SSH 密钥认证配置指南"
description: "不想每次 SSH 连接都输入密码？来看看如何在 Linux 服务器上配置 SSH 密钥认证吧。"
date: "2025-8-24"
readTime: "10 分钟"
tags: ["SSH", "Linux", "安全", "认证", "密钥"]
---

<script>
import PostHeader from '$lib/PostHeader.svelte';
import CodeBlock from '$lib/CodeBlock.svelte';

const generateKey = `ssh-keygen -t rsa`;

const keyGenInteraction = `Enter file in which to save the key (/home/user/.ssh/id_rsa): [直接按回车]
Enter passphrase (empty for no passphrase): [直接按回车]
Enter same passphrase again: [直接按回车]

Your identification has been saved in /home/user/.ssh/id_rsa.     # 私钥
Your public key has been saved in /home/user/.ssh/id_rsa.pub.     # 公钥
The key fingerprint is: SHA256:...`;

const setupAuth = `cd ~/.ssh
cat id_rsa.pub >> authorized_keys
chmod 600 authorized_keys
chmod 700 ~/.ssh`;

const editSshConfig = `sudo nano /etc/ssh/sshd_config`;

const sshConfigSetting = `PubkeyAuthentication yes`;

const restartSshd = `sudo systemctl restart sshd`;

const downloadKey = `get id_rsa`;

const vscodeSshConfig = `Host your-server
  HostName your-server-ip
  User your-username
  IdentityFile "path/to/your/private/key"`;

const testConnection = `ssh -i ~/.ssh/id_rsa user@server-ip`;
</script>

<PostHeader {title} {date} {readTime} {tags} />

SSH 密钥认证是一种比密码认证更安全、更便捷的服务器登录方式。通过公私钥对的方式，可以实现无密码登录，同时大大提高了连接的安全性。本文将详细介绍如何配置 SSH 密钥认证的完整流程。

## 什么是 SSH 密钥认证

SSH 密钥认证使用非对称加密算法，生成一对密钥：
- **私钥**：保存在客户端，用于身份验证
- **公钥**：放置在服务器上，用于验证客户端身份

这种方式相比密码认证具有以下优势：
- **更高安全性**：无法被暴力破解
- **便捷使用**：无需每次输入密码
- **批量管理**：适合管理多台服务器

## 环境要求

- **服务器端**：Linux 系统（Ubuntu、CentOS 等）
- **客户端**：支持 SSH 的操作系统
- **权限**：服务器 sudo 权限

## 1. 生成 SSH 密钥对

在**客户端**（本地计算机）执行以下命令生成 RSA 密钥对：

<CodeBlock code={generateKey} language="bash" title="生成 SSH 密钥对" />

命令执行后会有以下交互提示：

<CodeBlock code={keyGenInteraction} language="text" title="密钥生成交互过程" />

#### 重要说明

- **文件路径**：直接按回车使用默认路径 `~/.ssh/id_rsa`
- **密码保护**：为简化使用，本指南不设置密钥密码
- **密钥类型**：RSA 是最常用的密钥类型，兼容性好

## 2. 配置服务器端认证

将**公钥**上传到服务器并进行配置。

### 添加公钥到授权文件

在**服务器端**执行以下操作：

<CodeBlock code={setupAuth} language="bash" title="配置公钥认证" />

#### 权限设置说明

- `chmod 600 authorized_keys`：确保只有用户本人可以读写
- `chmod 700 ~/.ssh`：确保 .ssh 目录安全

### 启用 SSH 密钥认证

编辑 SSH 服务器配置文件：

<CodeBlock code={editSshConfig} language="bash" title="编辑 SSH 配置" />

找到 `PubkeyAuthentication` 配置项并设置为 `yes`：

<CodeBlock code={sshConfigSetting} language="conf" title="启用公钥认证" />

> **查找技巧**：在 nano 编辑器中使用 `Ctrl+W` 快速搜索配置项。

重启 SSH 服务使配置生效：

<CodeBlock code={restartSshd} language="bash" title="重启 SSH 服务" />

## 3. 客户端连接配置

根据不同的 SSH 客户端，配置方式略有不同。

### 通用 SSH 客户端

对于支持 OpenSSH 的客户端，可以直接使用命令行连接：

<CodeBlock code={testConnection} language="bash" title="测试密钥认证连接" />

### PuTTY 客户端配置

如果使用 PuTTY 连接：

1. **转换密钥格式**：
   - 打开 PuTTYGen 工具
   - 点击 "Load" 选择下载的私钥文件
   - 点击 "Save private key" 保存为 `.ppk` 格式

2. **配置 PuTTY**：
   - 在左侧菜单选择：`Connection` → `SSH` → `Auth` → `Credentials`
   - 在 "Private key file for authentication" 选择保存的 `.ppk` 文件

### VS Code Remote SSH 配置

如果使用 VS Code 的 Remote SSH 扩展：

编辑 SSH 配置文件（通常在 `~/.ssh/config`）：

<CodeBlock code={vscodeSshConfig} language="conf" title="VS Code SSH 配置" />

#### 配置参数说明

- `Host`：连接时使用的别名
- `HostName`：服务器的 IP 地址或域名
- `User`：登录用户名
- `IdentityFile`：私钥文件的绝对路径

## 4. 私钥文件管理

### 下载私钥

如果需要在其他设备使用，可以使用 SFTP 工具下载私钥：

<CodeBlock code={downloadKey} language="bash" title="下载私钥文件" />

> **安全提醒**：私钥文件非常重要，请妥善保管，避免泄露。

### 私钥安全建议

- **备份存储**：将私钥备份到安全位置
- **权限控制**：确保私钥文件权限为 600
- **定期轮换**：建议定期更新密钥对
- **多因素认证**：结合其他认证方式提高安全性

## 测试和验证

完成配置后，测试密钥认证是否工作正常：

1. **断开现有连接**
2. **使用密钥重新连接**
3. **确认无需输入密码**

如果连接成功且无需密码，说明 SSH 密钥认证配置成功。

## 故障排除

### 常见问题及解决方案

**连接仍需要密码**：
- 检查公钥是否正确添加到 `authorized_keys`
- 确认文件权限设置正确
- 验证 SSH 配置文件中 `PubkeyAuthentication` 设置

**权限被拒绝**：
- 检查 `.ssh` 目录权限是否为 700
- 确认 `authorized_keys` 文件权限是否为 600
- 验证私钥文件是否可读

**无法找到密钥文件**：
- 确认私钥路径配置正确
- 检查密钥文件是否存在且可访问

## 总结

SSH 密钥认证配置完成后，你将拥有：

- **安全的无密码登录**：提高服务器访问安全性
- **便捷的连接体验**：无需记住复杂密码
- **批量服务器管理**：一套密钥管理多台服务器
- **自动化脚本支持**：便于编写自动化部署脚本

> **安全提醒**：建议禁用密码认证，仅允许密钥认证，进一步提高服务器安全性。

## 参考资料

- [SSH 密钥认证官方文档](https://www.openssh.com/manual.html)
- [设置 SSH 通过密钥登录](https://www.runoob.com/w3cnote/set-ssh-login-key.html)
