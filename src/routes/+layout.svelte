<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Navigation } from '$lib';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- 全局导航组件 -->
<Navigation />

<!-- 主要内容区域 -->
<main>
	{@render children?.()}
</main>
