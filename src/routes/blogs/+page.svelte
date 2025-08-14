<script lang="ts">
	import { Calendar, Clock, ArrowRight } from "lucide-svelte";
	import type { PageData } from './$types';
	export let data: PageData;

	// 格式化日期
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString("zh-CN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}
</script>

<svelte:head>
	<title>博客 - 雾雨之乡</title>
	<meta name="description" content="技术文章和生活感悟分享" />
</svelte:head>

<div class="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
	<div
		class="flex flex-col justify-center items-center px-6 py-20 min-h-screen"
	>
		<!-- 页面标题 -->
		<div class="mb-12 text-center">
			<h1 class="mb-4 font-bold text-gray-900 text-4xl">博客</h1>
			<p class="text-gray-600 text-lg">分享技术文章和生活感悟</p>
		</div>

		<!-- 博客文章列表 -->
		<div class="space-y-6 w-full max-w-4xl">
			{#each data.posts as post (post.slug)}
				<article
					class="group bg-white/80 hover:bg-white shadow-md hover:shadow-lg backdrop-blur-sm p-6 border border-gray-200/50 rounded-xl transition-all duration-300"
				>
					<div class="flex flex-col">
						<!-- 文章标题 -->
						<h2
							class="mb-3 font-semibold text-gray-900 group-hover:text-blue-600 text-xl transition-colors"
						>
							<a href="/blogs/{post.slug}" class="hover:underline">
								{post.title}
							</a>
						</h2>

						<!-- 文章描述 -->
						<p class="mb-4 text-gray-600 leading-relaxed">
							{post.description}
						</p>

						<!-- 文章元数据 -->
						<div
							class="flex justify-between items-center mb-4 text-gray-500 text-sm"
						>
							<div class="flex items-center space-x-4">
								<div class="flex items-center">
									<Calendar class="mr-1 w-4 h-4" />
									<span>{formatDate(post.date)}</span>
								</div>
								{#if post.readTime}
								<div class="flex items-center">
									<Clock class="mr-1 w-4 h-4" />
									<span>{post.readTime}</span>
								</div>
								{/if}
							</div>
						</div>

						<!-- 标签 -->
						<div class="flex justify-between items-center">
							<div class="flex flex-wrap gap-2">
								{#each post.tags as tag (tag)}
									<span
										class="bg-blue-50 px-2 py-1 rounded-md font-medium text-blue-600 text-xs"
									>
										{tag}
									</span>
								{/each}
							</div>

							<!-- 阅读更多链接 -->
							<a
								href="/blogs/{post.slug}"
								class="flex items-center text-blue-600 hover:text-blue-700 transition-all group-hover:translate-x-1 duration-200"
							>
								<span class="mr-1 text-sm">阅读更多</span>
								<ArrowRight class="w-4 h-4" />
							</a>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<!-- 如果没有文章的提示 -->
		{#if !data.posts || data.posts.length === 0}
			<div
				class="bg-white/80 backdrop-blur-sm p-12 border border-gray-200/50 rounded-xl text-center"
			>
				<div class="mb-4 text-6xl">📝</div>
				<h3 class="mb-2 font-semibold text-gray-700 text-xl">
					暂无博客文章
				</h3>
				<p class="text-gray-500">敬请期待更多精彩内容！</p>
			</div>
		{/if}
	</div>
</div>
