import { error } from '@sveltejs/kit';
import HelloWorld from '../posts/HelloWorld.svelte';
import SvelteTips from '../posts/SvelteTips.svelte';
import DeployGuide from '../posts/DeployGuide.svelte';

// 博客文章映射（将文章ID映射到对应的Svelte组件）
const blogPosts = {
	'hello-world': {
		id: 'hello-world',
		title: '我的第一篇博客',
		description: '欢迎来到我的博客！这是我的第一篇文章，在这里我会分享一些技术文章和生活感悟。',
		date: '2025-01-15',
		readTime: '3 分钟',
		tags: ['介绍', 'Hello World'],
		component: HelloWorld
	},
	'svelte-tips': {
		id: 'svelte-tips',
		title: 'SvelteKit 开发小技巧',
		description: '分享一些在使用 SvelteKit 开发过程中的实用技巧和最佳实践。',
		date: '2025-01-10',
		readTime: '8 分钟',
		tags: ['SvelteKit', '前端', '技术'],
		component: SvelteTips
	},
	'deploy-guide': {
		id: 'deploy-guide',
		title: '项目构建与部署指南',
		description: '详细介绍如何构建项目并部署到生产环境，包括 Nginx 配置和 HTTPS 设置。',
		date: '2025-01-20',
		readTime: '10 分钟',
		tags: ['部署', 'Nginx', 'DevOps', 'HTTPS'],
		component: DeployGuide
	}
	// 你可以在这里添加更多博客文章
};

export const load = async ({ params }: { params: { slug: string } }) => {
	const post = blogPosts[params.slug as keyof typeof blogPosts];
	
	if (!post) {
		throw error(404, {
			message: '文章不存在'
		});
	}
	
	return {
		post
	};
};
