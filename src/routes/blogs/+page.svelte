<script lang="ts">
	import { Calendar, Clock, ArrowRight, Tag } from "lucide-svelte";
	import type { PageData } from "./$types";
	export let data: PageData;
	import { Avatar } from "$lib";

	// 搜索与筛选
	let search = "";
	let selectedTag: string | null = null;

	// 格式化日期
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString("zh-CN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	// 过滤后的博客
	$: filteredPosts = data.posts.filter((post) => {
		const keyword = search.trim().toLowerCase();
		const matchTag = selectedTag ? post.tags?.includes(selectedTag) : true;
		const matchText =
			post.title.toLowerCase().includes(keyword) ||
			post.description.toLowerCase().includes(keyword) ||
			(post.tags &&
				post.tags.some((t: string) =>
					t.toLowerCase().includes(keyword),
				));
		return matchTag && (keyword === "" || matchText);
	});
</script>

<svelte:head>
	<title>博客 - 雾雨之乡</title>
	<meta name="description" content="技术文章和生活感悟分享" />
</svelte:head>

<div class="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
	<div
		class="flex md:flex-row flex-col justify-center items-start gap-8 mx-auto px-6 py-20 max-w-5xl min-h-screen"
	>
		<!-- 左侧栏 -->
		<aside class="flex-shrink-0 mb-8 md:mb-0 w-full md:w-72">
			<div
				class="flex flex-col items-center bg-white/80 shadow mb-8 p-6 rounded-xl"
			>
				<Avatar />
				<div class="mb-1 font-bold text-lg">KisameVanilla</div>
				<div class="mb-2 text-gray-500 text-sm">博客作者</div>
			</div>
			<div class="bg-white/80 shadow mb-8 p-6 rounded-xl">
				<div class="flex items-center mb-2 font-semibold text-gray-700">
					<Tag class="mr-1 w-4 h-4" />所有标签
				</div>
				<div class="flex flex-wrap gap-2">
					{#each data.tags as tag}
						<button
							class="px-2 py-1 rounded text-xs font-medium border transition-all
								{selectedTag === tag
								? 'bg-blue-600 text-white border-blue-600'
								: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'}"
							on:click={() =>
								(selectedTag =
									selectedTag === tag ? null : tag)}
							>{tag}</button
						>
					{/each}
				</div>
			</div>
			<div class="bg-white/80 shadow p-6 rounded-xl">
				<div class="flex items-center mb-2 font-semibold text-gray-700">
					<Tag class="mr-1 w-4 h-4" />热门标签
				</div>
				<div class="flex flex-wrap gap-2">
					{#each data.topTags as t}
						<button
							class="px-2 py-1 rounded text-xs font-bold border border-yellow-400 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-all
								{selectedTag === t.tag ? 'ring-2 ring-yellow-400' : ''}"
							on:click={() =>
								(selectedTag =
									selectedTag === t.tag ? null : t.tag)}
							>{t.tag}
							<span class="ml-1 text-[10px]">{t.count}</span
							></button
						>
					{/each}
				</div>
			</div>
		</aside>

		<!-- 右侧内容 -->
		<main class="flex-1 mx-auto w-full max-w-3xl">
			<div class="flex sm:flex-row flex-col sm:items-center gap-4 mb-8">
				<input
					type="text"
					class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 w-full sm:w-80"
					placeholder="搜索标题、描述或标签..."
					bind:value={search}
				/>
				{#if selectedTag}
					<button
						class="bg-blue-100 ml-2 px-3 py-1 border border-blue-200 rounded font-medium text-blue-700 text-xs"
						on:click={() => (selectedTag = null)}
					>
						清除标签: {selectedTag}
					</button>
				{/if}
			</div>

			<!-- 博客文章列表 -->
			<div class="space-y-6">
				{#each filteredPosts as post (post.slug)}
					<article
						class="group bg-white/80 hover:bg-white shadow-md hover:shadow-lg backdrop-blur-sm p-6 border border-gray-200/50 rounded-xl transition-all duration-300"
					>
						<div class="flex flex-col">
							<!-- 文章标题 -->
							<h2
								class="mb-3 font-semibold text-gray-900 group-hover:text-blue-600 text-xl transition-colors"
							>
								<a
									href="/blogs/{post.slug}"
									class="hover:underline">{post.title}</a
								>
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
											>{tag}</span
										>
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
			{#if data.posts && data.posts.length !== 0 && (!filteredPosts || filteredPosts.length === 0)}
				<div
					class="bg-white/80 backdrop-blur-sm p-12 border border-gray-200/50 rounded-xl text-center"
				>
					<div class="mb-4 text-6xl">📝</div>
					<h3 class="mb-2 font-semibold text-gray-700 text-xl">
						暂无符合条件的博客文章
					</h3>
					<p class="text-gray-500">换个关键词或标签试试吧！</p>
				</div>
			{/if}
		</main>
	</div>
</div>
