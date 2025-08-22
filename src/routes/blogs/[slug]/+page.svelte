<script lang="ts">
	import { ArrowLeft, Calendar, Clock, Tag } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { Avatar } from "$lib";

	export let data;
	$: post = data.post;

	function goBack() {
		goto("/blogs");
	}

	// 格式化日期
	function formatDate(dateString: string) {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("zh-CN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}
</script>

<svelte:head>
	<title>{post.title} - 雾雨之乡</title>
	<meta name="description" content={post.description} />
</svelte:head>

<div class="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen">
	<div
		class="flex md:flex-row flex-col justify-center items-start gap-8 mx-auto px-6 py-20 max-w-7xl min-h-screen"
	>
		<!-- 左侧栏 -->
		<aside class="flex-shrink-0 mb-8 md:mb-0 w-full md:w-72">
			<!-- 返回按钮 -->
			<div class="mb-8">
				<button
					on:click={goBack}
					class="group flex items-center hover:bg-white/80 backdrop-blur-sm p-3 border border-gray-200/50 rounded-lg w-full transition-all duration-200"
				>
					<ArrowLeft
						class="mr-2 w-5 h-5 text-gray-600 transition-transform group-hover:-translate-x-1 duration-200"
					/>
					<span class="font-medium text-gray-700">返回博客列表</span>
				</button>
			</div>

			<!-- 作者信息 -->
			<div
				class="flex flex-col items-center bg-white/80 shadow mb-8 p-6 rounded-xl"
			>
				<Avatar />
				<div class="mb-1 font-bold text-lg">KisameVanilla</div>
				<div class="mb-2 text-gray-500 text-sm">博客作者</div>
			</div>

			<!-- 文章信息卡片 -->
			<div class="bg-white/80 shadow-lg backdrop-blur-sm mb-8 p-6 border border-gray-200/50 rounded-xl">
				<h1 class="mb-3 font-bold text-gray-900 text-xl leading-tight">
					{post.title}
				</h1>
				<p class="mb-4 text-gray-600 text-sm leading-relaxed">
					{post.description}
				</p>
				
				<!-- 文章元数据 -->
				{#if post.date || post.readTime}
					<div class="space-y-2 mb-4 text-gray-500 text-xs">
						{#if post.date}
							<div class="flex items-center">
								<Calendar class="mr-1 w-3 h-3" />
								<span>{formatDate(post.date)}</span>
							</div>
						{/if}
						{#if post.readTime}
							<div class="flex items-center">
								<Clock class="mr-1 w-3 h-3" />
								<span>{post.readTime}</span>
							</div>
						{/if}
					</div>
				{/if}

				<!-- 标签 -->
				{#if post.tags && post.tags.length > 0}
					<div class="mb-4">
						<div class="flex items-center mb-2 font-semibold text-gray-700 text-sm">
							<Tag class="mr-1 w-3 h-3" />标签
						</div>
						<div class="flex flex-wrap gap-2">
							{#each post.tags as tag}
								<span class="bg-blue-50 px-2 py-1 rounded-md font-medium text-blue-600 text-xs">
									{tag}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</aside>

		<!-- 右侧内容 -->
		<main class="flex-1 mx-auto w-full max-w-5xl">
			<div class="post-scroll-container">
				<!-- 文章内容 - 渲染 Svelte 组件 -->
				<div class="bg-white/80 shadow-lg backdrop-blur-sm p-8 border border-gray-200/50 rounded-xl prose prose-lg prose-gray">
					<svelte:component this={post.component} />
				</div>
			</div>
		</main>
	</div>
</div>

<style>
	/* 文章内容滚动容器 */
	.post-scroll-container {
		height: calc(100vh - 160px); /* 减去顶部和底部的padding */
		min-height: 400px;
		overflow-y: auto;
		padding-right: 2px;
	}

	/* 移动端调整 */
	@media (max-width: 768px) {
		.post-scroll-container {
			height: calc(100vh - 200px); /* 移动端给更多空间 */
		}
	}

	/* 确保移动端布局正确 */
	@media (max-width: 768px) {
		:global(.md\\:flex-row) {
			min-height: auto;
		}
	}

	/* 隐藏文章内容中的重复元数据 */
	:global(.prose header) {
		display: none;
	}

	/* 自定义文章内容样式 */
	:global(.prose h2) {
		font-size: 1.5rem;
		font-weight: 700;
		color: #111827;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	:global(.prose h3) {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	:global(.prose p) {
		color: #374151;
		line-height: 1.625;
		margin-bottom: 1rem;
	}

	:global(.prose ul) {
		list-style-type: disc;
		list-style-position: inside;
		margin-bottom: 1rem;
	}

	:global(.prose li) {
		color: #374151;
		margin-bottom: 0.5rem;
	}

	:global(.prose code) {
		background-color: #f3f4f6;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-family: monospace;
		color: #1f2937;
	}

	:global(.prose pre) {
		background-color: #111827;
		color: #f9fafb;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 1rem;
	}

	:global(.prose pre code) {
		background-color: transparent;
		padding: 0;
		color: #f9fafb;
	}

	:global(.prose strong) {
		font-weight: 600;
		color: #111827;
	}

	/* 链接样式 */
	:global(.prose a) {
		color: #2563eb;
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s ease;
	}

	:global(.prose a:hover) {
		border-bottom-color: #2563eb;
	}

	:global(.prose a:visited) {
		color: #7c3aed;
	}
</style>
