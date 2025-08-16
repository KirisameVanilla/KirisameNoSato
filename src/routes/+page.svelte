<script lang="ts">
	import {
		Github,
		Video,
		Link,
		Wrench,
		Download,
		Eye,
		GitBranch,
	} from "lucide-svelte";
	import { Avatar } from "$lib";

	// 你可以在这里修改你的个人信息和链接
	const profile = {
		name: "KirisameVanilla",
		bio: "桌面应用开发 / 前端开发",
		socialLinks: [
			{
				name: "GitHub",
				url: "https://github.com/kirisamevanilla",
				icon: Github,
				desc: "我的 GitHub",
			},
			{
				name: "BiliBili",
				url: "https://space.bilibili.com/281126067",
				icon: Video,
				desc: "我的 BiliBili",
			},
		],
	};

	const links = [
		{
			name: "TJA-Tools",
			url: "https://tools.taiko.vanillaaaa.org",
			icon: Wrench,
			desc: "可视化实时编辑太鼓谱面文件的工具",
		},
		{
			name: "TJA-Tatsujin",
			url: "https://taiko.vanillaaaa.org",
			icon: Download,
			desc: "第三方太鼓谱面下载站",
		},
		{
			name: "TJA-Viewer",
			url: "https://viewer.taiko.vanillaaaa.org",
			icon: Eye,
			desc: "可视化查看、播放太鼓谱面和音频文件的工具",
		},
		{
			name: "Kirisame's Gitea",
			url: "https://git.vanillaaaa.org",
			icon: GitBranch,
			desc: "自托管的 Git 服务",
		},
	];

	let showSocialMenu = $state(false);
	let showSocialLinks = $state(false);
	let isAnimating = $state(false);
	let isClosing = $state(false);

	function toggleSocialMenu() {
		if (isAnimating) return;
		isAnimating = true;

		if (!showSocialMenu) {
			// 打开菜单
			showSocialMenu = true;
			isClosing = false;
			// 等待主按钮飞行动画完成后再显示社交链接
			setTimeout(() => {
				showSocialLinks = true;
				isAnimating = false;
			}, 300);
		} else {
			// 关闭菜单
			closeSocialMenuInternal();
		}
	}

	function closeSocialMenu() {
		if (isAnimating) return;
		closeSocialMenuInternal();
	}

	function closeSocialMenuInternal() {
		isAnimating = true;
		isClosing = true;

		// 等待社交链接收缩动画完成后再隐藏它们
		setTimeout(() => {
			showSocialLinks = false;
			// 等待社交链接完全隐藏后，主按钮飞回右下角
			setTimeout(() => {
				showSocialMenu = false;
				isClosing = false;
				isAnimating = false;
			}, 300);
		}, 300); // 等待收缩动画完成
	}

	// 计算围绕中心点的位置
	function getCirclePosition(index: number, total: number, radius = 120) {
		const angle = (index * 2 * Math.PI) / total - Math.PI / 2; // 从顶部开始
		const x = Math.cos(angle) * radius;
		const y = Math.sin(angle) * radius;
		return { x, y };
	}
</script>

<svelte:head>
	<title>雾雨之乡</title>
	<meta name="description" content="雾雨之乡 - Kirisame No Sato" />
</svelte:head>

<main
	class="flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-100 w-screen min-h-screen"
>
	<div class="flex flex-col items-center mb-10">
		<Avatar />
		<h1 class="mb-1 font-bold text-2xl">{profile.name}</h1>
		<p class="text-slate-500 text-base">{profile.bio}</p>
	</div>
	<div class="flex flex-wrap justify-center gap-6 w-full max-w-2xl">
		{#each links as link (link.name)}
			<a
				class="flex flex-row items-center gap-4 bg-white hover:bg-blue-50 shadow-md hover:shadow-lg px-6 rounded-xl w-80 h-20 font-medium text-slate-800 text-lg no-underline hover:scale-105 transition-transform duration-150"
				href={link.url}
				target="_blank"
				rel="noopener noreferrer"
			>
				<link.icon size={24} class="mr-2 text-slate-600" />
				<div class="flex flex-col justify-center items-start">
					<span class="font-semibold text-base">{link.name}</span>
					<span class="mt-1 text-slate-500 text-sm">{link.desc}</span>
				</div>
			</a>
		{/each}
	</div>
</main>

<!-- 浮动社交链接按钮 -->
<div class="social-float-container">
	<!-- 背景遮罩 -->
	{#if showSocialMenu}
		<button
			class="social-backdrop"
			onclick={closeSocialMenu}
			tabindex="0"
			aria-label="关闭社交链接菜单"
			onkeydown={(e) =>
				e.key === "Enter" || e.key === " " ? closeSocialMenu() : null}
		></button>
	{/if}

	<!-- 主按钮 -->
	<button
		class="social-main-btn {showSocialMenu ? 'centered' : ''}"
		onclick={toggleSocialMenu}
		disabled={isAnimating}
	>
		<Link class="social-icon" size={24} />
	</button>

	<!-- 社交链接按钮 -->
	{#if showSocialLinks}
		{#each profile.socialLinks as socialLink, index (socialLink.name)}
			{@const position = getCirclePosition(
				index,
				profile.socialLinks.length,
			)}
			<a
				class="social-link-btn {isClosing ? 'closing' : ''}"
				href={socialLink.url}
				target="_blank"
				rel="noopener noreferrer"
				title={socialLink.desc}
				style="--x: {position.x}px; --y: {position.y}px; transform: translate(calc(50% + {position.x}px), calc(50% + {position.y}px));"
			>
				<socialLink.icon size={20} class="text-slate-700" />
			</a>
		{/each}
	{/if}
</div>

<style>
	.social-float-container {
		position: fixed;
		z-index: 1000;
	}

	.social-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(5px);
		animation: fadeIn 0.3s ease-out;
		border: none;
		cursor: pointer;
	}

	.social-main-btn {
		position: fixed;
		bottom: 30px;
		right: 30px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border: none;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		z-index: 1001;
	}

	.social-main-btn:hover {
		transform: scale(1.1);
		box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
	}

	.social-main-btn.centered {
		bottom: 50%;
		right: 50%;
		transform: translate(50%, 50%) scale(1.2);
	}

	.social-main-btn :global(svg) {
		color: white;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}

	.social-link-btn {
		position: fixed;
		bottom: 50%;
		right: 50%;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: white;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		animation: socialLinkAppear 0.3s ease-out forwards;
		z-index: 1002;
		transform-origin: center;
	}

	.social-link-btn.closing {
		animation: socialLinkDisappear 0.3s ease-in forwards;
	}

	.social-link-btn:hover {
		transform: translate(calc(50% + var(--x)), calc(50% + var(--y)))
			scale(1.15);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes socialLinkAppear {
		0% {
			transform: translate(50%, 50%) scale(0);
			opacity: 0;
		}
		100% {
			transform: translate(calc(50% + var(--x)), calc(50% + var(--y)))
				scale(1);
			opacity: 1;
		}
	}

	@keyframes socialLinkDisappear {
		0% {
			transform: translate(calc(50% + var(--x)), calc(50% + var(--y)))
				scale(1);
			opacity: 1;
		}
		100% {
			transform: translate(50%, 50%) scale(0);
			opacity: 0;
		}
	}
</style>
