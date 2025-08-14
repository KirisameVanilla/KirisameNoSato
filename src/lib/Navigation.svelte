<script lang="ts">
	import { Menu, X, Home, User, Mail, Settings } from 'lucide-svelte';
	import { slide, fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	
	let isMenuOpen = false;
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	function closeMenu() {
		isMenuOpen = false;
	}
	
	// 导航菜单项配置
	const menuItems = [
		{
			label: '首页',
			href: '/',
			icon: Home
		},
		{
			label: '关于',
			href: '/about',
			icon: User
		},
		{
			label: '联系',
			href: '/contact', 
			icon: Mail
		},
		{
			label: '设置',
			href: '/settings',
			icon: Settings
		}
	];
</script>

<!-- 菜单按钮 -->
<div class="top-4 left-1/2 z-50 fixed -translate-x-1/2 transform">
	<button
		on:click={toggleMenu}
		class="bg-white/90 hover:bg-white shadow-lg hover:shadow-xl backdrop-blur-sm p-3 border border-gray-200/50 rounded-full active:scale-95 transition-all duration-200"
		aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
	>
		<div class="relative w-5 h-5">
			{#if isMenuOpen}
				<div 
					class="absolute inset-0 flex justify-center items-center"
					transition:fade={{ duration: 200, easing: quintOut }}
				>
					<X class="w-5 h-5 text-gray-700" />
				</div>
			{:else}
				<div 
					class="absolute inset-0 flex justify-center items-center"
					transition:fade={{ duration: 200, easing: quintOut }}
				>
					<Menu class="w-5 h-5 text-gray-700" />
				</div>
			{/if}
		</div>
	</button>
</div>

<!-- 导航菜单 -->
{#if isMenuOpen}
	<!-- 背景遮罩 -->
	<div 
		class="z-40 fixed inset-0 bg-black/20 backdrop-blur-sm"
		on:click={closeMenu}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Escape' && closeMenu()}
		transition:fade={{ duration: 200 }}
	></div>
	
	<!-- 菜单内容 -->
	<nav 
		class="top-0 right-0 left-0 z-40 fixed"
		transition:fly={{ y: -20, duration: 300, easing: quintOut }}
	>
		<div class="bg-white/95 shadow-lg backdrop-blur-md border-gray-200/50 border-b">
			<div class="mx-auto px-6 py-4 max-w-4xl">
				<div class="flex justify-center">
					<div class="gap-4 grid grid-cols-2 md:grid-cols-4 mt-12 w-full max-w-2xl">
						{#each menuItems as item, index}
							<a
								href={item.href}
								on:click={closeMenu}
								class="group flex flex-col items-center hover:bg-gray-50 p-4 rounded-lg transition-colors duration-200"
								transition:fly={{ y: -10, duration: 200, delay: index * 50, easing: quintOut }}
							>
								<div class="bg-gray-100 group-hover:bg-gray-200 mb-2 p-2 rounded-full transition-colors duration-200">
									<svelte:component 
										this={item.icon} 
										class="w-5 h-5 text-gray-600 group-hover:text-gray-800" 
									/>
								</div>
								<span class="font-medium text-gray-700 group-hover:text-gray-900 text-sm">
									{item.label}
								</span>
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</nav>
{/if}

<style>
	/* 确保菜单在移动端也能正常工作 */
	@media (max-width: 768px) {
		nav .grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>