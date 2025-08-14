<script context="module" lang="ts">
	export const metadata = {
		title: "SvelteKit 开发小技巧",
		description:
			"分享一些在使用 SvelteKit 开发过程中的实用技巧和最佳实践。",
		date: "2025-08-14",
		readTime: "5 分钟",
		tags: ["SvelteKit", "前端", "技术"],
	};
</script>

<script lang="ts">
	import { Calendar, Clock, Tag } from "lucide-svelte";
	import { onMount } from "svelte";

	// 交互式演示变量
	let count = 0;
	let doubled = 0;
	let inputValue = "";
	let filteredItems = [];

	const items = ["苹果", "香蕉", "橙子", "葡萄", "草莓", "蓝莓"];

	// 响应式声明演示
	$: doubled = count * 2;
	$: filteredItems = items.filter((item) =>
		item.toLowerCase().includes(inputValue.toLowerCase()),
	);

	// 格式化日期
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString("zh-CN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	onMount(() => {
		console.log("组件已挂载");
	});
</script>

<!-- 文章头部信息 -->
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

	<!-- 标签 -->
	<div class="flex flex-wrap gap-2 mb-6">
		{#each metadata.tags as tag (tag)}
			<span
				class="flex items-center bg-blue-50 px-3 py-1 rounded-full font-medium text-blue-600 text-sm"
			>
				<Tag class="mr-1 w-3 h-3" />
				{tag}
			</span>
		{/each}
	</div>
</header>

<!-- 文章内容 -->
<article class="max-w-none prose prose-lg">
	<h2>SvelteKit 开发小技巧</h2>
	<p>
		SvelteKit
		是一个强大的全栈框架，在使用过程中我总结了一些实用的技巧和最佳实践。
	</p>

	<h3>1. 响应式声明的魅力</h3>
	<p>
		Svelte 的响应式声明让状态管理变得简单直观。使用 <code>$:</code> 标记可以创建自动更新的计算属性：
	</p>

	<!-- 交互式演示 -->
	<div
		class="bg-blue-50 mb-6 p-6 border border-blue-200 rounded-lg not-prose"
	>
		<h4 class="mb-4 font-semibold text-blue-800 text-lg">🎮 交互式演示</h4>
		<div class="flex items-center gap-4 mb-4">
			<button
				on:click={() => count++}
				class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors"
			>
				增加计数器
			</button>
			<button
				on:click={() => (count = 0)}
				class="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-white transition-colors"
			>
				重置
			</button>
		</div>
		<p class="text-gray-700">
			计数器: <span class="font-bold text-blue-600">{count}</span>
		</p>
		<p class="text-gray-700">
			两倍值: <span class="font-bold text-green-600">{doubled}</span>
		</p>
		<code class="block bg-gray-100 mt-3 p-3 rounded text-sm"
			>$: doubled = count * 2;</code
		>
	</div>

	<h3>2. 使用 $page 获取路由信息</h3>
	<p>在组件中可以通过 <code>$page</code> store 获取当前页面的路由信息：</p>
	<pre><code
			>import &#123; page &#125; from '$app/stores';

// 获取当前路径
console.log($page.url.pathname);

// 获取查询参数
console.log($page.url.searchParams.get('id'));</code
		></pre>

	<h3>3. 预加载数据</h3>
	<p>
		使用 <code>+page.ts</code> 或 <code>+layout.ts</code> 文件可以在页面渲染前预加载数据：
	</p>
	<pre><code
			>export async function load(&#123; fetch, params &#125;) &#123;
    const response = await fetch(&#96;/api/posts/$&#123;params.id&#125;&#96;);
    const post = await response.json();
    
    return &#123;
        post
    &#125;;
&#125;</code
		></pre>

	<h3>4. 条件渲染和循环</h3>
	<p>Svelte 的模板语法让条件渲染和列表渲染变得非常直观：</p>

	<!-- 搜索演示 -->
	<div
		class="bg-green-50 mb-6 p-6 border border-green-200 rounded-lg not-prose"
	>
		<h4 class="mb-4 font-semibold text-green-800 text-lg">🔍 搜索演示</h4>
		<input
			bind:value={inputValue}
			placeholder="搜索水果..."
			class="mb-4 p-2 border border-gray-300 rounded w-full"
		/>
		<div class="space-y-2">
			{#each filteredItems as item (item)}
				<div class="bg-white p-2 border rounded">{item}</div>
			{:else}
				<p class="text-gray-500">没有找到匹配的水果</p>
			{/each}
		</div>
		<p class="mt-2 text-gray-600 text-sm">
			找到 {filteredItems.length} 个结果
		</p>
	</div>

	<h3>5. 组件生命周期</h3>
	<p>理解和合理使用生命周期钩子：</p>
	<pre><code
			>import &#123; onMount, onDestroy &#125; from 'svelte';

onMount(() => &#123;
    console.log('组件已挂载');
    // 初始化操作
&#125;);

onDestroy(() => &#123;
    console.log('组件即将销毁');
    // 清理操作
&#125;);</code
		></pre>

	<h3>6. 使用 Stores 进行状态管理</h3>
	<p>对于全局状态，Svelte 的 stores 是最佳选择：</p>
	<pre><code
			>// stores.ts
import &#123; writable &#125; from 'svelte/store';
export const user = writable(null);
export const theme = writable('light');

// 在组件中使用
import &#123; user &#125; from './stores';
$user = &#123; name: '小明', age: 25 &#125;;</code
		></pre>

	<h3>7. 性能优化技巧</h3>
	<p>几个提升性能的小建议：</p>
	<ul>
		<li>使用 <code>keyed each</code> 循环优化列表渲染</li>
		<li>合理使用 <code>onMount</code> 和 <code>onDestroy</code></li>
		<li>避免在模板中使用复杂计算，使用响应式声明代替</li>
		<li>使用 <code>tick()</code> 等待DOM更新完成</li>
	</ul>

	<h3>总结</h3>
	<p>
		这些技巧可以帮助你更高效地使用 SvelteKit
		开发应用。记住，最好的学习方式是实践！
	</p>

	<blockquote>
		<p>
			💡 <strong>提示</strong>：本文中的交互式演示都是用 Svelte
			实现的，展示了框架的强大功能。你可以直接在文章中体验这些特性！
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
	}

	.not-prose p {
		margin-bottom: 0.5rem;
	}

	.not-prose code {
		font-family: monospace;
		background-color: #f3f4f6;
		padding: 0.75rem;
		border-radius: 0.375rem;
		display: block;
		font-size: 0.875rem;
	}

	/* 修复按钮样式 */
	.not-prose button {
		all: revert;
		display: inline-block;
		cursor: pointer;
		border: none;
		font-family: inherit;
		font-size: 0.875rem;
		line-height: 1.5;
		text-align: center;
		text-decoration: none;
		vertical-align: middle;
		user-select: none;
		border-radius: 0.375rem;
		padding: 0.5rem 1rem;
		margin: 0.125rem;
		transition: all 0.2s ease;
	}

	.not-prose button.bg-blue-600 {
		background-color: #2563eb;
		color: white;
	}

	.not-prose button.bg-blue-600:hover {
		background-color: #1d4ed8;
	}

	.not-prose button.bg-gray-500 {
		background-color: #6b7280;
		color: white;
	}

	.not-prose button.bg-gray-500:hover {
		background-color: #4b5563;
	}

	/* 修复输入框样式 */
	.not-prose input {
		all: revert;
		display: block;
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		line-height: 1.5;
		background-color: white;
		margin-bottom: 1rem;
	}

	.not-prose input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	/* 修复其他元素 */
	.not-prose div {
		display: block;
	}

	.not-prose span {
		display: inline;
	}
</style>
