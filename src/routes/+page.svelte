
<script>
	// 你可以在这里修改你的个人信息和链接
	const profile = {
		name: 'Kirisame Vanilla',
		avatar: '/favicon.jpg',
		bio: '桌面应用开发 / 前端开发',
		links: [
			{
				name: 'TJA-Tools',
				url: 'https://tools.taiko.vanillaaaa.org',
				icon: '🛠️',
				desc: '可视化实时编辑太鼓谱面文件的工具'
			},
			{
				name: 'TJA-Tatsujin',
				url: 'https://taiko.vanillaaaa.org',
				icon: '📥',
				desc: '第三方太鼓谱面下载站'
			},
			{
				name: 'TJA-Viewer',
				url: 'https://viewer.taiko.vanillaaaa.org',
				icon: '👀',
				desc: '可视化查看、播放太鼓谱面和音频文件的工具'
			},
			{
				name: 'GitHub',
				url: 'https://github.com/kirisamevanilla',
				icon: '🌐',
				desc: '项目开源仓库'
			},
            {
                name: 'KirisameVanilla\'s Gitea',
                url: 'https://git.vanillaaaa.org',
                icon: '🌐',
                desc: '自托管的 Git 服务，用于存放一些不便于存放的项目'
            }
		]
	};
</script>


<main class="flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-100 w-screen min-h-screen">
	<div class="flex flex-col items-center mb-10">
		<img class="shadow mb-4 border-2 border-blue-100 rounded-full w-24 h-24" src={profile.avatar} alt="avatar" />
		<h1 class="mb-1 font-bold text-2xl">{profile.name}</h1>
		<p class="text-slate-500 text-base">{profile.bio}</p>
	</div>
	<div class="flex flex-wrap justify-center gap-6 w-full max-w-2xl">
		{#each profile.links as link}
			<a class="flex flex-row items-center gap-4 bg-white hover:bg-blue-50 shadow-md hover:shadow-lg px-6 rounded-xl w-80 h-20 font-medium text-slate-800 text-lg no-underline hover:scale-105 transition-transform duration-150" href={link.url} target="_blank" rel="noopener noreferrer">
				<span class="mr-2 text-3xl">{link.icon}</span>
				<div class="flex flex-col justify-center items-start">
					<span class="font-semibold text-base">{link.name}</span>
					<span class="mt-1 text-slate-500 text-sm">{link.desc}</span>
				</div>
			</a>
		{/each}
	</div>
</main>


