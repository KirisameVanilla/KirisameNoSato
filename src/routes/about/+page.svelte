<script lang="ts">
	import	{ Timeline,	 type TimelineEvent } from '$lib';
	import { onMount } from 'svelte';
	
	const timelineEvents: TimelineEvent[] = [
		{
			id: '2025-shanghai-kongan-internship',
			title: '上海控安实习',
			date: '2025-07-15',
			description: '入职上海控安，作为软件开发工程师助理进行独立Python软件开发实习。',
			tags: ['Python', '软件开发', '实习', '上海控安'],
			type: 'work' as const,
			color: '#10B981'
		},
		{
			id: '2025-komeijihelper-project',
			title: '全栈项目开发',
			date: '2025-03-01',
			description: '大三下学期课程项目，使用 Vue.js 和 Java SpringBoot 进行全栈开发 komeijihelper，对前端开发兴趣大增。',
			tags: ['Vue.js', 'SpringBoot', 'Java', '全栈开发'],
			type: 'project' as const,
			color: '#8B5CF6',
			link: 'https://github.com/komeijihelper/komeijihelper'
		},
		{
			id: '2025-android-kotlin-development',
			title: '安卓开发学习',
			date: '2025-01-29',
			description: '开始接触 Kotlin 安卓开发，为 PaperPig/MaimaiData 项目作出贡献。',
			tags: ['Kotlin', 'Android', '开源贡献'],
			icon: '�',
			type: 'project' as const,
			color: '#3DDC84',
			link: 'https://github.com/PaperPig/MaimaiData'
		},
		{
			id: '2024-high-intensity-plugin-dev',
			title: 'Dalamud 插件开发',
			date: '2024-09-23',
			description: '开始接触 C# 类库开发，高强度为 Dalamud-DailyRoutines 组织提供代码，持续到 2024年12月28日。',
			tags: ['C#', '插件开发', 'Dalamud', '游戏工具'],
			type: 'project' as const,
			color: '#512BD4'
		},
		{
			id: '2024-flutter-meeting-room-system',
			title: 'Flutter 前端开发',
			date: '2024-09-27',
			description: '因课程需要使用 Flutter 开发会议室管理系统前端，首次接触前端开发领域。',
			tags: ['Flutter', 'Dart', '前端开发', '课程项目'],
			icon: '�',
			type: 'project' as const,
			color: '#0175C2',
			link: 'https://github.com/KirisameVanilla/meeting_room_appointment_system'
		},
		{
			id: '2024-csharp-snowbreak-tools',
			title: 'C# 开发起点',
			date: '2024-07-23',
			description: '因尘白禁区游戏开始接触 C#，辅助开发尘白禁区工具箱项目。',
			tags: ['C#', '游戏工具', '开源项目'],
			type: 'project' as const,
			color: '#512BD4',
			link: 'https://github.com/Makstein/SnowbreakGachaExport'
		},
		{
			id: '2024-bank-security-internship',
			title: '银行安全评估实习',
			date: '2024-07-15',
			description: '在四川新网银行安全评估岗进行为期一个月的学习，掌握了常见漏洞排查处理和 DevSecOps 理念。',
			tags: ['网络安全', '漏洞评估', 'DevSecOps', '实习'],
			type: 'work' as const,
			color: '#DC2626'
		},
		{
			id: '2023-python-java-courses',
			title: 'Python & Java 学习',
			date: '2023-03-01',
			description: '大一下学期学习 Python 和 Java 的学校课程，扩展编程语言技能。',
			tags: ['Python', 'Java', '学校课程', '面向对象'],
			type: 'education' as const,
			color: '#F59E0B'
		},
		{
			id: '2022-university-enrollment',
			title: '华师大软工入学',
			date: '2022-09-01',
			description: '入学华东师范大学软件工程专业，开始系统学习 C 语言编程。',
			tags: ['华东师大', '软件工程', 'C语言', '大学'],
			type: 'education' as const,
			color: '#3B82F6'
		},
		{
			id: '2022-cpp-introduction',
			title: '编程启蒙',
			date: '2022-07-01',
			description: '通过观看 C++ 视频教程接触编程基础知识，踏上编程学习之路。',
			tags: ['C++', '编程入门', '自学'],
			icon: '�',
			type: 'education' as const,
			color: '#00599C'
		}
	];

	// 生成大纲数据（按时间排序）
	const outlineItems = timelineEvents
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map(event => ({
			id: event.id,
			title: event.title,
			year: new Date(event.date).getFullYear()
		}));

	// 按年份分组大纲（按年份排序）
	const outlineByYear = outlineItems.reduce((acc, item) => {
		const year = item.year.toString();
		if (!acc[year]) acc[year] = [];
		acc[year].push(item);
		return acc;
	}, {} as Record<string, typeof outlineItems>);

	// 排序后的年份列表
	const sortedOutlineYears = Object.keys(outlineByYear).sort((a, b) => parseInt(a) - parseInt(b));

	let activeEventId = $state('');
	let showOutline = $state(true);
	let showMobileOutline = $state(false);

	// 滚动到指定事件
	function scrollToEvent(eventId: string) {
		const element = document.querySelector(`[data-id="${eventId}"]`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'center' });
			activeEventId = eventId;
		}
	}

	// 监听滚动事件，更新激活状态
	onMount(() => {
		const handleScroll = () => {
			const timelineItems = document.querySelectorAll('[data-id]');
			const scrollTop = window.scrollY + window.innerHeight / 2;
			
			let currentActive = '';
			timelineItems.forEach((item) => {
				const rect = item.getBoundingClientRect();
				const top = rect.top + window.scrollY;
				const bottom = top + rect.height;
				
				if (scrollTop >= top && scrollTop <= bottom) {
					currentActive = item.getAttribute('data-id') || '';
				}
			});
			
			if (currentActive) {
				activeEventId = currentActive;
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // 初始调用
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<title>关于我 - KirisameVanilla</title>
	<meta name="description" content="了解我的编程学习和开发经历" />
</svelte:head>

<div class="bg-gradient-to-br from-slate-50 to-blue-100 min-h-screen">
	<!-- 移动端大纲按钮 -->
	<button 
		class="lg:hidden top-20 right-4 z-50 fixed bg-white/90 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm p-3 border border-gray-200/50 rounded-full transition-all"
		onclick={() => showMobileOutline = !showMobileOutline}
		aria-label="打开时间线大纲"
	>
		<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
		</svg>
	</button>

	<!-- 移动端大纲遮罩 -->
	{#if showMobileOutline}
		<div 
			class="lg:hidden z-40 fixed inset-0 bg-black/50 transition-opacity"
			onclick={() => showMobileOutline = false}
			onkeydown={(e) => e.key === 'Escape' && (showMobileOutline = false)}
			role="button"
			tabindex="0"
			aria-label="关闭大纲"
		></div>
	{/if}

	<!-- 移动端大纲 -->
	<div class="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-sm shadow-xl border-l border-gray-200/50 z-50 transform transition-transform duration-300 lg:hidden {showMobileOutline ? 'translate-x-0' : 'translate-x-full'}">
		<div class="p-6">
			<div class="flex justify-between items-center mb-6">
				<h2 class="font-bold text-gray-800 text-xl">我的时间线</h2>
				<button 
					class="hover:bg-gray-100 p-2 rounded-lg transition-colors"
					onclick={() => showMobileOutline = false}
					aria-label="关闭大纲"
				>
					<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
			</div>

			<div class="space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
				{#each sortedOutlineYears as year}
					{@const events = outlineByYear[year]}
					<div class="space-y-2">
						<div class="bg-blue-50 px-3 py-1 rounded-lg font-semibold text-blue-600 text-sm">
							{year} 年
						</div>
						{#each events as event}
							<button
								class="w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 border-l-4 {activeEventId === event.id ? 'bg-blue-100 border-blue-500 text-blue-800' : 'border-transparent hover:border-blue-300'}"
								onclick={() => {
									scrollToEvent(event.id);
									showMobileOutline = false;
								}}
							>
								<div class="flex items-center space-x-3">
									<div class="flex-shrink-0 bg-blue-500 rounded-full w-3 h-3"></div>
									<div class="flex-1 min-w-0">
										<div class="font-medium text-gray-800 text-sm truncate">
											{event.title}
										</div>
									</div>
								</div>
							</button>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- 桌面端左侧固定大纲 -->
	<div class="fixed left-0 top-0 h-full w-80 bg-white/80 backdrop-blur-sm shadow-lg border-r border-gray-200/50 z-40 transform transition-transform duration-300 {showOutline ? 'translate-x-0' : '-translate-x-72'} hidden lg:block">
		<div class="p-6">
			<div class="flex justify-between items-center mb-6">
				<h2 class="font-bold text-gray-800 text-xl">我的时间线</h2>
				<button 
					class="hover:bg-gray-100 p-2 rounded-lg transition-colors"
					onclick={() => showOutline = !showOutline}
					aria-label="收起大纲"
				>
					<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
					</svg>
				</button>
			</div>

			<div class="space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
				{#each sortedOutlineYears as year}
					{@const events = outlineByYear[year]}
					<div class="space-y-2">
						<div class="bg-blue-50 px-3 py-1 rounded-lg font-semibold text-blue-600 text-sm">
							{year} 年
						</div>
						{#each events as event}
							<button
								class="w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 border-l-4 {activeEventId === event.id ? 'bg-blue-100 border-blue-500 text-blue-800' : 'border-transparent hover:border-blue-300'}"
								onclick={() => scrollToEvent(event.id)}
							>
								<div class="flex items-center space-x-3">
									<div class="flex-shrink-0 bg-blue-500 rounded-full w-3 h-3"></div>
									<div class="flex-1 min-w-0">
										<div class="font-medium text-gray-800 text-sm truncate">
											{event.title}
										</div>
									</div>
								</div>
							</button>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- 桌面端大纲收起/展开按钮 (隐藏时显示) -->
	{#if !showOutline}
		<button 
			class="hidden lg:block top-1/2 left-2 z-50 fixed bg-white/90 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm p-3 border border-gray-200/50 rounded-r-lg transition-all -translate-y-1/2"
			onclick={() => showOutline = true}
			aria-label="展开大纲"
		>
			<svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
			</svg>
		</button>
	{/if}

	<!-- 主内容区域 -->
	<div class="transition-all duration-300 {showOutline ? 'lg:ml-80' : 'lg:ml-0'}">
		<div class="mx-auto px-4 py-16 max-w-4xl container">
			<!-- 页面标题 -->
			<div class="mb-16 text-center">
				<h1 class="mb-4 font-bold text-gray-800 text-4xl md:text-5xl">
					我的编程之路
				</h1>
				<p class="mx-auto max-w-2xl text-gray-600 text-xl">
					从零开始的编程学习旅程，记录每一个重要的里程碑和成长经历
				</p>
			</div>

			<!-- Timeline 组件 -->
			<div class="bg-white/80 shadow-xl backdrop-blur-sm p-8 border border-gray-200/50 rounded-2xl">
				<Timeline 
					events={timelineEvents} 
					theme="light"
					showIcons={false}
					showYears={true}
					compact={false}
				/>
			</div>

			<!-- 技能总结 -->
			<div class="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-16">
				<div class="bg-white/80 shadow-lg backdrop-blur-sm p-6 border border-gray-200/50 rounded-xl">
					<div class="mb-3 text-2xl">�</div>
					<h3 class="mb-3 font-semibold text-gray-800 text-xl">后端开发</h3>
					<p class="text-gray-600">
						Python、Java、SpringBoot 全栈开发经验
					</p>
				</div>

				<div class="bg-white/80 shadow-lg backdrop-blur-sm p-6 border border-gray-200/50 rounded-xl">
					<div class="mb-3 text-2xl">🌐</div>
					<h3 class="mb-3 font-semibold text-gray-800 text-xl">前端开发</h3>
					<p class="text-gray-600">
						Vue.js、Flutter 移动端和Web端开发
					</p>
				</div>

				<div class="bg-white/80 shadow-lg backdrop-blur-sm p-6 border border-gray-200/50 rounded-xl">
					<div class="mb-3 text-2xl">⚙️</div>
					<h3 class="mb-3 font-semibold text-gray-800 text-xl">插件开发</h3>
					<p class="text-gray-600">
						C# 类库开发，Dalamud 插件生态贡献
					</p>
				</div>

				<div class="bg-white/80 shadow-lg backdrop-blur-sm p-6 border border-gray-200/50 rounded-xl">
					<div class="mb-3 text-2xl">🛡️</div>
					<h3 class="mb-3 font-semibold text-gray-800 text-xl">安全评估</h3>
					<p class="text-gray-600">
						漏洞排查处理，DevSecOps 理念实践
					</p>
				</div>

				<div class="bg-white/80 shadow-lg backdrop-blur-sm p-6 border border-gray-200/50 rounded-xl">
					<div class="mb-3 text-2xl">📱</div>
					<h3 class="mb-3 font-semibold text-gray-800 text-xl">移动开发</h3>
					<p class="text-gray-600">
						Kotlin Android 开发，跨平台应用构建
					</p>
				</div>

				<div class="bg-white/80 shadow-lg backdrop-blur-sm p-6 border border-gray-200/50 rounded-xl">
					<div class="mb-3 text-2xl">�</div>
					<h3 class="mb-3 font-semibold text-gray-800 text-xl">游戏工具</h3>
					<p class="text-gray-600">
						游戏辅助工具开发，开源项目贡献
					</p>
				</div>

				<div class="bg-white/80 shadow-lg backdrop-blur-sm p-6 border border-gray-200/50 rounded-xl">
					<div class="mb-3 text-2xl">🏢</div>
					<h3 class="mb-3 font-semibold text-gray-800 text-xl">实习经验</h3>
					<p class="text-gray-600">
						银行安全评估，软件开发工程师实习
					</p>
				</div>

				<div class="bg-white/80 shadow-lg backdrop-blur-sm p-6 border border-gray-200/50 rounded-xl">
					<div class="mb-3 text-2xl">📚</div>
					<h3 class="mb-3 font-semibold text-gray-800 text-xl">持续学习</h3>
					<p class="text-gray-600">
						从 C++ 到全栈，持续探索新技术栈
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* 确保大纲滚动条样式 */
	.space-y-4::-webkit-scrollbar {
		width: 4px;
	}
	
	.space-y-4::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.05);
		border-radius: 2px;
	}
	
	.space-y-4::-webkit-scrollbar-thumb {
		background: rgba(59, 130, 246, 0.3);
		border-radius: 2px;
	}
	
	.space-y-4::-webkit-scrollbar-thumb:hover {
		background: rgba(59, 130, 246, 0.5);
	}

	/* 移动端优化 */
	@media (max-width: 1024px) {
		.fixed.left-0 {
			display: none !important;
		}
	}
</style>
