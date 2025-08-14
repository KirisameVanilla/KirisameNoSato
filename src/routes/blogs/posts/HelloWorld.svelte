<!-- 我的第一篇博客 - Hello World -->
<script lang="ts">
	import { Calendar, Clock, Tag } from 'lucide-svelte';
	
	// 文章元数据
	const meta = {
		title: '我的第一篇博客',
		description: '欢迎来到我的博客！这是我的第一篇文章，在这里我会分享一些技术文章和生活感悟。',
		date: '2025-01-15',
		readTime: '3 分钟',
		tags: ['介绍', 'Hello World']
	};
	
	// 格式化日期
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('zh-CN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
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
		{#each meta.tags as tag}
			<span class="flex items-center bg-blue-50 px-3 py-1 rounded-full font-medium text-blue-600 text-sm">
				<Tag class="mr-1 w-3 h-3" />
				{tag}
			</span>
		{/each}
	</div>
</header>

<!-- 文章内容 -->
<article class="max-w-none prose prose-lg">
	<h2>欢迎来到我的博客！</h2>
	<p>你好！很高兴你能访问我的博客。这是我的第一篇文章，标志着我开始在这里分享我的想法、经验和学习心得。</p>
	
	<h3>关于这个博客</h3>
	<p>在这个博客中，我计划分享：</p>
	<ul>
		<li>技术文章和教程</li>
		<li>项目开发经验</li>
		<li>学习笔记和心得</li>
		<li>生活中的思考和感悟</li>
	</ul>
	
	<h3>技术栈</h3>
	<p>这个博客是用 <strong>SvelteKit</strong> 构建的，使用了以下技术：</p>
	<ul>
		<li><strong>SvelteKit</strong> - 现代框架</li>
		<li><strong>TypeScript</strong> - 类型安全</li>
		<li><strong>Tailwind CSS</strong> - 实用优先的CSS框架</li>
		<li><strong>Lucide Svelte</strong> - 精美的图标库</li>
	</ul>
	
	<h3>为什么选择 Svelte？</h3>
	<p>Svelte 是一个令人惊喜的框架，它有以下优点：</p>
	<ul>
		<li>🚀 <strong>性能优秀</strong> - 编译时优化，运行时轻量</li>
		<li>📝 <strong>语法简洁</strong> - 更少的样板代码</li>
		<li>🎯 <strong>响应式</strong> - 内置响应式系统</li>
		<li>📦 <strong>包体积小</strong> - 没有虚拟DOM的开销</li>
	</ul>
	
	<p>感谢你的阅读，希望我的文章能对你有所帮助！如果你有任何问题或建议，欢迎与我交流。</p>
	
	<blockquote>
		<p>💡 <strong>提示</strong>：这个博客的所有文章都是用 Svelte 组件编写的，这让我可以在文章中嵌入交互式内容！</p>
	</blockquote>
</article>
