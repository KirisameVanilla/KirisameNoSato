<!-- 项目构建与部署指南 -->
<script lang="ts">
    import {
        Calendar,
        Clock,
        Tag,
        Copy,
        Check,
        Terminal,
        Server,
        Shield,
    } from "lucide-svelte";
    import { onMount } from "svelte";

    // 文章元数据
    const meta = {
        title: "项目构建与部署指南",
        description:
            "详细介绍如何构建项目并部署到生产环境，包括 Nginx 配置和 HTTPS 设置。",
        date: "2025-01-20",
        readTime: "10 分钟",
        tags: ["部署", "Nginx", "DevOps", "HTTPS"],
    };

    // 交互式复制功能
    let copiedStates: { [key: string]: boolean } = {};

    // 格式化日期
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    // 复制代码功能
    async function copyCode(code: string, id: string) {
        try {
            await navigator.clipboard.writeText(code);
            copiedStates[id] = true;
            setTimeout(() => {
                copiedStates[id] = false;
            }, 2000);
        } catch (err) {
            console.error("复制失败:", err);
        }
    }

    // 代码块数据
    const codeBlocks = {
        build: "npm run build",
        nginxConfig: `server {
    listen 80;
    server_name your-domain.com;

    root /var/www/kirisame-nosato;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}`,
        enableSite: `sudo ln -s /etc/nginx/sites-available/kirisame-nosato /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx`,
        certbot: `# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 申请证书并自动配置
sudo certbot --nginx -d your-domain.com

# 测试自动续期
sudo certbot renew --dry-run`,
    };

    onMount(() => {
        console.log("部署指南文章已加载");
    });
</script>

<!-- 文章头部信息 -->
<header class="mb-8">
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div class="flex items-center space-x-4 text-gray-500 text-sm">
            <div class="flex items-center">
                <Calendar class="mr-2 w-4 h-4" />
                <span>{formatDate(meta.date)}</span>
            </div>
            <div class="flex items-center">
                <Clock class="mr-2 w-4 h-4" />
                <span>{meta.readTime}</span>
            </div>
        </div>
    </div>

    <!-- 标签 -->
    <div class="flex flex-wrap gap-2 mb-6">
        {#each meta.tags as tag (tag)}
            <span
                class="flex items-center bg-green-50 px-3 py-1 rounded-full font-medium text-green-600 text-sm"
            >
                <Tag class="mr-1 w-3 h-3" />
                {tag}
            </span>
        {/each}
    </div>
</header>

<!-- 文章内容 -->
<article class="max-w-none prose prose-lg">
    <h2>🚀 项目构建与部署完整指南</h2>
    <p>
        本文将详细介绍如何构建 SvelteKit 项目并部署到生产环境，包括 Nginx
        配置、HTTPS 设置等完整流程。
    </p>

    <h3>📦 项目构建</h3>
    <p>
        SvelteKit 项目使用静态适配器，可以构建为静态文件部署到任何 Web 服务器。
    </p>

    <!-- 构建命令演示 -->
    <div
        class="bg-gray-50 mb-6 p-6 border border-gray-200 rounded-lg not-prose"
    >
        <div class="flex justify-between items-center mb-3">
            <h4 class="flex items-center font-semibold text-gray-800 text-lg">
                <Terminal class="mr-2 w-5 h-5" />
                构建项目
                <button
                    on:click={() => copyCode(codeBlocks.build, "build")}
                    class="flex items-center bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm transition-colors"
                >
                    {#if copiedStates.build}
                        <Check class="mr-1 w-4 h-4" />
                        已复制
                    {:else}
                        <Copy class="mr-1 w-4 h-4" />
                        复制
                    {/if}
                </button>
            </h4>
        </div>
        <pre
            class="bg-gray-900 p-4 rounded overflow-x-auto text-green-400"><code
                >{codeBlocks.build}</code
            ></pre>
    </div>
    <p class="mt-3 text-gray-600 text-sm">
        构建完成后，静态文件会生成到 <code>build/</code> 目录中。
    </p>

    <h3>🌐 Nginx 配置</h3>
    <p>
        使用 Nginx 作为 Web 服务器可以提供高性能的静态文件服务和良好的缓存控制。
    </p>

    <!-- Nginx 配置演示 -->
    <div
        class="bg-blue-50 mb-6 p-6 border border-blue-200 rounded-lg not-prose"
    >
        <div class="flex justify-between items-center mb-3">
            <h4 class="flex items-center font-semibold text-blue-800 text-lg">
                <Server class="mr-2 w-5 h-5" />
                Nginx 站点配置<button
                    on:click={() =>
                        copyCode(codeBlocks.nginxConfig, "nginxConfig")}
                    class="flex items-center bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm transition-colors"
                >
                    {#if copiedStates.nginxConfig}
                        <Check class="mr-1 w-4 h-4" />
                        已复制
                    {:else}
                        <Copy class="mr-1 w-4 h-4" />
                        复制
                    {/if}
                </button>
            </h4>
        </div>
        <pre
            class="bg-gray-900 p-4 rounded overflow-x-auto text-gray-100 text-sm"><code
                >{codeBlocks.nginxConfig}</code
            ></pre>
    </div>
    <div class="space-y-2 mt-4 text-blue-700 text-sm">
        <p><strong>📝 配置说明：</strong></p>
        <ul class="space-y-1 list-disc list-inside">
            <li>
                <strong>try_files</strong>：支持 SPA 路由，所有路径都回退到
                index.html
            </li>
            <li>
                <strong>静态资源缓存</strong>：为 JS、CSS、图片等文件设置 1
                年缓存
            </li>
            <li><strong>immutable</strong>：告诉浏览器这些文件永远不会改变</li>
        </ul>
    </div>

    <p>
        将上述配置保存为 <code>/etc/nginx/sites-available/kirisame-nosato</code
        >，然后启用站点：
    </p>

    <!-- 启用站点命令 -->
    <div
        class="bg-gray-50 mb-6 p-6 border border-gray-200 rounded-lg not-prose"
    >
        <div class="flex justify-between items-center mb-3">
            <h4 class="flex items-center font-semibold text-gray-800 text-lg">
                <Terminal class="mr-2 w-5 h-5" />
                启用 Nginx 站点<button
                    on:click={() =>
                        copyCode(codeBlocks.enableSite, "enableSite")}
                    class="flex items-center bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm transition-colors"
                >
                    {#if copiedStates.enableSite}
                        <Check class="mr-1 w-4 h-4" />
                        已复制
                    {:else}
                        <Copy class="mr-1 w-4 h-4" />
                        复制
                    {/if}
                </button>
            </h4>
        </div>
        <pre
            class="bg-gray-900 p-4 rounded overflow-x-auto text-green-400"><code
                >{codeBlocks.enableSite}</code
            ></pre>
    </div>

    <h3>🔒 HTTPS 配置</h3>
    <p>使用 Let's Encrypt 免费 SSL 证书为网站启用 HTTPS，提供安全加密连接。</p>

    <!-- HTTPS 配置演示 -->
    <div
        class="bg-green-50 mb-6 p-6 border border-green-200 rounded-lg not-prose"
    >
        <div class="flex justify-between items-center mb-3">
            <h4 class="flex items-center font-semibold text-green-800 text-lg">
                <Shield class="mr-2 w-5 h-5" />
                Let's Encrypt HTTPS 配置<button
                    on:click={() => copyCode(codeBlocks.certbot, "certbot")}
                    class="flex items-center bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm transition-colors"
                >
                    {#if copiedStates.certbot}
                        <Check class="mr-1 w-4 h-4" />
                        已复制
                    {:else}
                        <Copy class="mr-1 w-4 h-4" />
                        复制
                    {/if}
                </button>
            </h4>
        </div>
        <pre
            class="bg-gray-900 p-4 rounded overflow-x-auto text-green-400"><code
                >{codeBlocks.certbot}</code
            ></pre>
    </div>
    <div class="bg-green-100 mt-4 p-3 rounded">
        <p class="font-semibold text-green-800 text-sm">💡 小贴士</p>
        <p class="text-green-700 text-sm">
            Certbot 会自动修改 Nginx 配置，添加 SSL 相关设置并设置 HTTP 到 HTTPS
            的重定向。
        </p>
    </div>
    <h3>📋 部署清单</h3>
    <p>按照以下步骤完成完整的部署流程：</p>

    <!-- 部署步骤检查表 -->
    <div
        class="bg-purple-50 mb-6 p-6 border border-purple-200 rounded-lg not-prose"
    >
        <h4 class="mb-4 font-semibold text-purple-800 text-lg">🔢 部署步骤</h4>
        <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
                <input
                    type="checkbox"
                    class="w-5 h-5 text-purple-600 form-checkbox"
                />
                <span class="text-purple-700"
                    >1. 在本地运行 <code>npm run build</code> 构建项目</span
                >
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
                <input
                    type="checkbox"
                    class="w-5 h-5 text-purple-600 form-checkbox"
                />
                <span class="text-purple-700"
                    >2. 将 <code>build/</code> 目录上传到服务器
                    <code>/var/www/kirisame-nosato/</code></span
                >
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
                <input
                    type="checkbox"
                    class="w-5 h-5 text-purple-600 form-checkbox"
                />
                <span class="text-purple-700"
                    >3. 创建并配置 Nginx 站点配置文件</span
                >
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
                <input
                    type="checkbox"
                    class="w-5 h-5 text-purple-600 form-checkbox"
                />
                <span class="text-purple-700"
                    >4. 启用 Nginx 站点并重新加载配置</span
                >
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
                <input
                    type="checkbox"
                    class="w-5 h-5 text-purple-600 form-checkbox"
                />
                <span class="text-purple-700"
                    >5. 使用 Certbot 申请和配置 SSL 证书</span
                >
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
                <input
                    type="checkbox"
                    class="w-5 h-5 text-purple-600 form-checkbox"
                />
                <span class="text-purple-700"
                    >6. 测试网站访问和 HTTPS 重定向</span
                >
            </label>
        </div>
    </div>

    <h3>🚨 常见问题排查</h3>

    <div class="bg-yellow-50 mb-6 p-6 border border-yellow-200 rounded-lg">
        <h4 class="mb-3 font-semibold text-yellow-800">⚠️ 问题：404 错误</h4>
        <p class="mb-2 text-yellow-700">
            如果刷新页面时出现 404 错误，检查 Nginx 配置中的 <code
                >try_files</code
            > 指令是否正确。
        </p>
        <p class="text-yellow-700 text-sm">
            <strong>解决方案</strong>：确保
            <code>try_files $uri $uri/ /index.html;</code> 配置正确。
        </p>
    </div>

    <div class="bg-red-50 mb-6 p-6 border border-red-200 rounded-lg">
        <h4 class="mb-3 font-semibold text-red-800">
            🔥 问题：静态资源加载失败
        </h4>
        <p class="mb-2 text-red-700">
            如果 CSS、JS 文件加载失败，可能是路径或权限问题。
        </p>
        <p class="text-red-700 text-sm">
            <strong>解决方案</strong>：检查文件权限
            <code>chmod -R 755 /var/www/kirisame-nosato</code>
        </p>
    </div>

    <h3>🎯 总结</h3>
    <p>
        通过以上配置，你的 SvelteKit
        项目就可以在生产环境中稳定运行了。这个配置提供了：
    </p>
    <ul>
        <li>🚀 <strong>高性能</strong>：Nginx 提供快速的静态文件服务</li>
        <li>📱 <strong>SPA 支持</strong>：正确处理前端路由</li>
        <li>💾 <strong>缓存优化</strong>：静态资源长期缓存</li>
        <li>🔒 <strong>安全连接</strong>：自动 HTTPS 和证书续期</li>
    </ul>

    <blockquote>
        <p>
            💡 <strong>提示</strong
            >：记得定期更新服务器和证书，保持系统安全性。你可以设置自动化部署脚本来简化未来的更新流程。
        </p>
    </blockquote>
</article>

<style>
    /* 自定义样式 */
    .not-prose * {
        all: unset;
    }

    .not-prose {
        display: block;
    }

    .not-prose h4 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
    }

    .not-prose code {
        font-family: monospace;
        background-color: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
    }

    .not-prose pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-all;
    }

    .not-prose pre code {
        background-color: transparent;
        padding: 0;
    }

    .not-prose button {
        all: revert;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        border: none;
        font-family: inherit;
        font-size: 0.875rem;
        line-height: 1.5;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        border-radius: 0.375rem;
        padding: 0.25rem 0.75rem;
        transition: all 0.2s ease;
    }

    .not-prose input[type="checkbox"] {
        all: revert;
        width: 1.25rem;
        height: 1.25rem;
        accent-color: #9333ea;
    }

    .not-prose label {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
</style>
