---
title: "在 Windows 系统上使用 GPG 认证 git commit"
description: "在 Windows 上使用 gpg4win 生成 GPG 密钥并为 git 提交签名的完整步骤与排查要点。"
date: "2025-08-18"
readTime: "6 分钟"
tags: ["Git", "GPG", "Windows"]
---

<script>
  import PostHeader from '$lib/PostHeader.svelte';
  import CodeBlock from '$lib/CodeBlock.svelte';
</script>

<PostHeader 
  date={metadata.date}
  readTime={metadata.readTime} 
  tags={metadata.tags}
/>

<article class="max-w-none prose prose-lg">

## 在 Windows 上为 Git 提交启用 GPG 签名

本文介绍如何在 Windows 环境安装 gpg4win、生成 GPG 密钥并配置 Git 在提交时使用该密钥签名，以及常见的排查方法。

### 1. 推荐安装 gpg4win

访问下列页面下载安装包并按提示完成安装：

[gpg4win 官网](https://gpg4win.org/index.html)

安装完成后，重启终端（PowerShell / CMD）以确保 gpg 命令可用。

### 2. 生成密钥

在终端运行：

<CodeBlock code="gpg --full-generate-key" />

按提示选择：
- 密钥类型：推荐 RSA and RSA (default)
- 密钥长度：推荐 4096 位
- 有效期：根据个人偏好设置（0 = 永不过期）
- 输入姓名、邮箱地址（确保邮箱与你的 GitHub 账号关联）
- 创建密钥密码

### 3. 查看已有密钥

<CodeBlock code="gpg --list-keys
gpg --list-secret-keys" />

记录你要使用的密钥 ID（40位）。

### 4. 导出公钥

<CodeBlock code="gpg --armor --export YOUR_KEY_ID" />

将输出结果复制，然后在 [GitHub 设置](https://github.com/settings/keys) 中添加刚刚复制的 GPG 密钥，并在 *Vigilant mode* 中勾选 *Flag unsigned commits as unverified*。

### 5. 配置 Git 使用 GPG

<CodeBlock code="git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true" />

### 6. 指定 gpg 程序路径（可选但推荐）

<CodeBlock code='git config --global gpg.program "C:\\Program Files\\GnuPG\\bin\\gpg.exe"' />

### 7. 验证签名

<CodeBlock code="git log --show-signature -1
git show --show-signature COMMIT_HASH" />

### 常见排查要点

- 确保 GPG 密钥的 uid 中的邮箱已经在 GitHub 上验证并绑定。
- 使用 `gpg --list-secret-keys` 确认私钥存在。
- 如有多个 gpg 版本，使用 `git config --global gpg.program` 指向正确的 gpg.exe。
- 检查环境变量 `GNUPGHOME` 是否指向你期望的密钥目录。
- 在 Windows 上，gpg4win 自带的 pinentry 会在需要时提示输入密钥密码，确保能在当前终端或 GUI 环境中正确交互。

### 总结

流程要点：安装 gpg4win → 生成 RSA4096 密钥 → 导出并在 GitHub 添加公钥 → 配置 Git 使用 signingkey 并默认签名 → 如有问题，指定正确的 gpg 程序并检查密钥是否在密钥环中可见。

</article>
