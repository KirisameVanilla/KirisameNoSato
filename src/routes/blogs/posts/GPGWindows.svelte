<script context="module" lang="ts">
    export const metadata = {
        title: "在 Windows 系统上使用 GPG 认证 git commit",
        description: "在 Windows 上使用 gpg4win 生成 GPG 密钥并为 git 提交签名的完整步骤与排查要点。",
        date: "2025-08-18",
        readTime: "6 分钟",
        tags: ["Git", "GPG", "Windows"],
    };
</script>

<script lang="ts">
    import { Calendar, Clock, Tag, Copy, Check } from "lucide-svelte";

    let copiedStates: { [key: string]: boolean } = {};

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    async function copyCode(code: string, id: string) {
        try {
            await navigator.clipboard.writeText(code);
            copiedStates[id] = true;
            setTimeout(() => (copiedStates[id] = false), 2000);
        } catch (err) {
            console.error("复制失败:", err);
        }
    }

    const codeBlocks = {
        gen: `gpg --full-generate-key`,
        
        list: `gpg --list-keys
gpg --list-secret-keys`,
        
        export: `gpg --armor --export {KEY_ID}`,
        
        gitConfig: `git config --global user.signingkey {KEY_ID}
git config --global commit.gpgsign true`,
        
        gpgProgram: `git config --global gpg.program "C:\\Program Files\\GnuPG\\bin\\gpg.exe"`,
        
        verify: `git log --show-signature -1
git show --show-signature <commit-hash>`,
    };
</script>

<header class="mb-8">
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div class="flex items-center space-x-4 text-gray-500 text-sm">
            <div class="flex items-center">
                <Calendar class="mr-2 w-4 h-4" />
                <span>{formatDate(metadata.date)}</span>
            </div>
            <div class="flex items-center">
                <Clock class="mr-2 w-4 h-4" />
                <span>{metadata.readTime}</span>
            </div>
        </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
        {#each metadata.tags as tag (tag)}
            <span class="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm">
                <Tag class="inline-block mr-1 w-3 h-3" />
                {tag}
            </span>
        {/each}
    </div>
</header>

<article class="max-w-none prose prose-lg">
    <h2>在 Windows 上为 Git 提交启用 GPG 签名</h2>
    <p>本文介绍如何在 Windows 环境安装 gpg4win、生成 GPG 密钥并配置 Git 在提交时使用该密钥签名，以及常见的排查方法。</p>

    <h3>1. 推荐安装 gpg4win</h3>
    <p>访问下列页面下载安装包并按提示完成安装：</p>
    <a href="https://gpg4win.org/index.html" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
        gpg4win 官网
    </a>
    <p>安装完成后，重启终端（PowerShell / CMD）以确保 gpg 命令可用。</p>

    <h3>2. 生成密钥</h3>
    <p>在终端运行：</p>
    <div class="bg-gray-50 mb-4 p-4 rounded not-prose">
        <div class="code-container">
            <button on:click={() => copyCode(codeBlocks.gen, 'gen')} class="copy-button">
                {#if copiedStates.gen}
                    <Check class="inline mr-1 w-3 h-3" /> 已复制
                {:else}
                    <Copy class="inline mr-1 w-3 h-3" /> 复制
                {/if}
            </button>
            <pre><code>{codeBlocks.gen}</code></pre>
        </div>
    </div>
    <div class="bg-blue-50 mb-4 p-3 rounded">
        <p class="mb-2 text-blue-800 text-sm"><strong>按提示选择：</strong></p>
        <ul class="space-y-1 text-blue-700 text-sm">
            <li>1. 加密/签名类型：选择第一个（RSA and RSA）</li>
            <li>2. 密钥长度：4096</li>
            <li>3. 过期时间：按需选择（0 表示永不过期，或 1y、2y）</li>
            <li>4. 用户信息：填写你的 Git commit 使用的 user.name 和 user.email</li>
            <li>5. 注意：email 必须与 GitHub 账户能绑定的邮箱一致</li>
            <li>6. 密钥密码：设置一个安全密码，用于保护私钥</li>
        </ul>
    </div>

    <h3>3. 查找并导出公钥</h3>
    <p>生成完成后可以使用下列命令查看密钥：</p>
    <div class="bg-gray-50 mb-4 p-4 rounded not-prose">
        <div class="code-container">
            <button on:click={() => copyCode(codeBlocks.list, 'list')} class="copy-button">
                {#if copiedStates.list}
                    <Check class="inline mr-1 w-3 h-3" /> 已复制
                {:else}
                    <Copy class="inline mr-1 w-3 h-3" /> 复制
                {/if}
            </button>
            <pre><code>{codeBlocks.list}</code></pre>
        </div>
    </div>
    <p class="mb-4 text-gray-600 text-sm">第一个命令查看所有密钥，第二个命令确认私钥是否存在。</p>
    
    <p>记下显示的密钥 ID（16 进制 ID），然后导出 armored 公钥：</p>
    <div class="bg-gray-50 mb-4 p-4 rounded not-prose">
        <div class="code-container">
            <button on:click={() => copyCode(codeBlocks.export, 'export')} class="copy-button">
                {#if copiedStates.export}
                    <Check class="inline mr-1 w-3 h-3" /> 已复制
                {:else}
                    <Copy class="inline mr-1 w-3 h-3" /> 复制
                {/if}
            </button>
            <pre><code>{codeBlocks.export}</code></pre>
        </div>
    </div>
    <p class="mb-4 text-gray-600 text-sm">将 <code>&#123;KEY_ID&#125;</code> 替换为你的实际密钥 ID，然后复制从 <code>-----BEGIN PGP PUBLIC KEY BLOCK-----</code> 到 <code>-----END PGP PUBLIC KEY BLOCK-----</code> 的整个区块。</p>

    <h3>4. 在 GitHub 添加 GPG Key</h3>
    <p>打开 GitHub 设置中的 GPG Keys 页面（Settings → SSH and GPG keys），新建 GPG key 并粘贴上一步导出的公钥内容，保存并按照页面提示完成验证。</p>

    <h3>5. 配置 Git 使用该密钥</h3>
    <p>将密钥 ID 设置为全局 signing key 并默认签名每次提交：</p>
    <div class="bg-gray-50 mb-4 p-4 rounded not-prose">
        <div class="code-container">
            <button on:click={() => copyCode(codeBlocks.gitConfig, 'gitConfig')} class="copy-button">
                {#if copiedStates.gitConfig}
                    <Check class="inline mr-1 w-3 h-3" /> 已复制
                {:else}
                    <Copy class="inline mr-1 w-3 h-3" /> 复制
                {/if}
            </button>
            <pre><code>{codeBlocks.gitConfig}</code></pre>
        </div>
    </div>
    <p class="mb-4 text-gray-600 text-sm">将 <code>&#123;KEY_ID&#125;</code> 替换为你的实际密钥 ID。第一个命令设置全局签名密钥，第二个命令开启默认每次 commit 都签名。</p>

    <h3>6. 指定 gpg 可执行程序（如果使用 gpg4win）</h3>
    <p>如果你安装了 gpg4win 而不是使用 Git 自带的 gpg，Git 可能找不到私钥，这时需要指定 gpg 程序路径：</p>
    <div class="bg-gray-50 mb-4 p-4 rounded not-prose">
        <div class="code-container">
            <button on:click={() => copyCode(codeBlocks.gpgProgram, 'gpgProgram')} class="copy-button">
                {#if copiedStates.gpgProgram}
                    <Check class="inline mr-1 w-3 h-3" /> 已复制
                {:else}
                    <Copy class="inline mr-1 w-3 h-3" /> 复制
                {/if}
            </button>
            <pre><code>{codeBlocks.gpgProgram}</code></pre>
        </div>
    </div>
    <p class="mb-4 text-gray-600 text-sm">这是 gpg4win 的默认安装路径示例，请根据你的实际安装位置调整路径。</p>
    <p>常见错误提示为：</p>
    <pre class="bg-yellow-50 p-3 rounded text-yellow-800 text-sm not-prose">gpg: skipped "&#123;id&#125;": No secret key
gpg: signing failed: No secret key</pre>
    <p>若出现上述错误，通常是因为 Git 调用了其他 gpg 版本或找不到私钥。指定正确的 gpg 路径并确保密钥在当前用户的密钥环中可见（<code>gpg --list-secret-keys</code>）。</p>

    <h3>7. 验证签名</h3>
    <p>提交后可以用下列命令查看签名状态：</p>
    <div class="bg-gray-50 mb-4 p-4 rounded not-prose">
        <div class="code-container">
            <button on:click={() => copyCode(codeBlocks.verify, 'verify')} class="copy-button">
                {#if copiedStates.verify}
                    <Check class="inline mr-1 w-3 h-3" /> 已复制
                {:else}
                    <Copy class="inline mr-1 w-3 h-3" /> 复制
                {/if}
            </button>
            <pre><code>{codeBlocks.verify}</code></pre>
        </div>
    </div>
    <p class="mb-4 text-gray-600 text-sm">第一个命令查看最近一次提交的签名信息，第二个命令查看指定提交的签名。如果看到 "Good signature from ..." 表示签名有效。</p>

    <h3>常见排查要点</h3>
    <ul>
        <li>确保 GPG 密钥的 uid 中的邮箱已经在 GitHub 上验证并绑定。</li>
        <li>使用 <code>gpg --list-secret-keys</code> 确认私钥存在。</li>
        <li>如有多个 gpg 版本，使用 <code>git config --global gpg.program</code> 指向正确的 gpg.exe。</li>
        <li>检查环境变量 <code>GNUPGHOME</code> 是否指向你期望的密钥目录。</li>
        <li>在 Windows 上，gpg4win 自带的 pinentry 会在需要时提示输入密钥密码，确保能在当前终端或 GUI 环境中正确交互。</li>
    </ul>

    <h3>总结</h3>
    <p>流程要点：安装 gpg4win → 生成 RSA4096 密钥 → 导出并在 GitHub 添加公钥 → 配置 Git 使用 signingkey 并默认签名 → 如有问题，指定正确的 gpg 程序并检查密钥是否在密钥环中可见。</p>

</article>

<style>
    /* 重置 not-prose 样式但保持基本布局 */
    .not-prose {
        display: block;
    }
    
    .not-prose * {
        all: revert;
    }
    
    /* 代码块容器 */
    .not-prose .code-container {
        position: relative;
        background-color: #1f2937;
        border-radius: 0.375rem;
        overflow: hidden;
    }
    
    /* 确保代码块正确显示换行 */
    .not-prose pre {
        display: block;
        margin: 0;
        padding: 0.75rem;
        background-color: transparent;
        border-radius: 0;
        overflow-x: auto;
    }
    
    .not-prose pre code {
        display: block;
        color: #f3f4f6;
        font-size: 0.875rem;
        line-height: 1.5;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: 'Courier New', Consolas, monospace;
    }
    
    /* 复制按钮样式 - 悬浮在代码块内 */
    .not-prose .copy-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        display: inline-flex;
        align-items: center;
        background-color: rgba(37, 99, 235, 0.8);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        border: none;
        cursor: pointer;
        backdrop-filter: blur(4px);
        transition: background-color 0.2s;
    }
    
    .not-prose .copy-button:hover {
        background-color: rgba(29, 78, 216, 0.9);
    }
</style>
