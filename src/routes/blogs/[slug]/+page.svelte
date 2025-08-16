<script lang="ts">
	import { ArrowLeft } from "lucide-svelte";
	import { goto } from "$app/navigation";

	export let data;
	$: post = data.post;

	function goBack() {
		goto("/blogs");
	}
</script>

<svelte:head>
	<title>{post.title} - 雾雨之乡</title>
	<meta name="description" content={post.description} />
</svelte:head>

<div class="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen">
	<div
		class="flex flex-col justify-center items-center px-6 py-20 min-h-screen"
	>
		<!-- 返回按钮 -->
		<div class="w-full max-w-4xl">
			<button
				on:click={goBack}
				class="group flex items-center hover:bg-white/80 backdrop-blur-sm mb-8 p-3 border border-gray-200/50 rounded-lg transition-all duration-200"
			>
				<ArrowLeft
					class="mr-2 w-5 h-5 text-gray-600 transition-transform group-hover:-translate-x-1 duration-200"
				/>
				<span class="font-medium text-gray-700">返回博客列表</span>
			</button>
		</div>

		<!-- 文章头部 -->
		<header
			class="bg-white/80 shadow-lg backdrop-blur-sm mb-8 p-8 border border-gray-200/50 rounded-xl w-full max-w-4xl"
		>
			<h1 class="mb-4 font-bold text-gray-900 text-4xl leading-tight">
				{post.title}
			</h1>
			<p class="mb-6 text-gray-600 text-lg leading-relaxed">
				{post.description}
			</p>
		</header>

		<!-- 文章内容 - 渲染 Svelte 组件 -->
		<div
			class="bg-white/80 shadow-lg backdrop-blur-sm p-8 border border-gray-200/50 rounded-xl w-full max-w-4xl prose prose-lg prose-gray"
		>
			<svelte:component this={post.component} />
		</div>

		<!-- 文章底部 -->
		<footer class="mt-8 w-full max-w-4xl text-center">
			<button
				on:click={goBack}
				class="group bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-white transition-colors duration-200"
			>
				<ArrowLeft
					class="inline mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1 duration-200"
				/>
				返回博客列表
			</button>
		</footer>
	</div>
</div>

<style>
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
</style>
