<script lang="ts">
	export let events: TimelineEvent[] = [];
	export let theme: 'light' | 'dark' = 'light';
	export let showIcons: boolean = true;
	export let showYears: boolean = true;
	export let compact: boolean = false;

	interface TimelineEvent {
		id: string;
		title: string;
		date: string;
		description?: string;
		tags?: string[];
		icon?: string; // emoji or icon class
		color?: string; // hex color for the timeline dot
		link?: string; // optional link
		image?: string; // optional image
		type?: 'education' | 'work' | 'project' | 'achievement' | 'personal' | 'other';
	}

	// 按日期排序事件 (从旧到新)
	$: sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	// 获取年份分组（按年份排序）
	$: eventsByYear = sortedEvents.reduce((acc, event) => {
		const year = new Date(event.date).getFullYear().toString();
		if (!acc[year]) acc[year] = [];
		acc[year].push(event);
		return acc;
	}, {} as Record<string, TimelineEvent[]>);

	// 按年份排序的年份列表
	$: sortedYears = Object.keys(eventsByYear).sort((a, b) => parseInt(a) - parseInt(b));

	// 根据类型获取默认颜色
	function getEventColor(event: TimelineEvent): string {
		if (event.color) return event.color;
		
		switch (event.type) {
			case 'education': return '#3B82F6';
			case 'work': return '#10B981';
			case 'project': return '#8B5CF6';
			case 'achievement': return '#F59E0B';
			case 'personal': return '#EF4444';
			default: return '#6B7280';
		}
	}

	// 格式化日期
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('zh-CN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="timeline-container" class:dark={theme === 'dark'} class:compact class:show-icons={showIcons}>
	{#each sortedYears as year}
		{@const yearEvents = eventsByYear[year]}
		{#if showYears}
			<div class="year-divider">
				<span class="year-label">{year}</span>
			</div>
		{/if}

		{#each yearEvents as event, index}
			<div class="timeline-item" data-id={event.id}>
				<div class="timeline-dot-container">
					<div 
						class="timeline-dot" 
						style="background-color: {getEventColor(event)}"
					>
						{#if showIcons && event.icon}
							<span class="timeline-icon">{event.icon}</span>
						{/if}
					</div>
					{#if index < yearEvents.length - 1 || sortedYears.indexOf(year) < sortedYears.length - 1}
						<div class="timeline-line"></div>
					{/if}
				</div>

				<div class="timeline-content">
					<div class="timeline-header">
						<h3 class="timeline-title">
							{#if event.link}
								<a href={event.link} target="_blank" rel="noopener noreferrer">
									{event.title}
								</a>
							{:else}
								{event.title}
							{/if}
						</h3>
						<time class="timeline-date">{formatDate(event.date)}</time>
					</div>

					{#if event.description}
						<p class="timeline-description">{event.description}</p>
					{/if}

					{#if event.image}
						<div class="timeline-image">
							<img src={event.image} alt={event.title} />
						</div>
					{/if}

					{#if event.tags && event.tags.length > 0}
						<div class="timeline-tags">
							{#each event.tags as tag}
								<span class="timeline-tag" style="border-color: {getEventColor(event)}">{tag}</span>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	{/each}
</div>

<style>
	.timeline-container {
		position: relative;
		padding: 2rem 0;
		max-width: 800px;
		margin: 0 auto;
	}

	.timeline-container.compact {
		padding: 1rem 0;
	}

	.year-divider {
		position: relative;
		margin: 3rem 0 2rem;
		text-align: center;
	}

	.year-label {
		display: inline-block;
		background: var(--bg-color, #ffffff);
		color: var(--primary-color, #3B82F6);
		font-size: 1.5rem;
		font-weight: 700;
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 2;
	}

	.year-divider::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(to right, transparent, var(--border-color, #E5E7EB), transparent);
		z-index: 1;
	}

	.timeline-item {
		position: relative;
		display: flex;
		margin-bottom: 2rem;
		opacity: 0;
		animation: fadeInUp 0.6s ease-out forwards;
	}

	.timeline-container.compact .timeline-item {
		margin-bottom: 1.5rem;
	}

	.timeline-dot-container {
		position: relative;
		flex-shrink: 0;
		margin-right: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.timeline-dot {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 0 4px var(--bg-color, #ffffff), 0 0 0 8px currentColor;
		position: relative;
		z-index: 2;
	}

	/* 当不显示图标时，使用更小的圆点 */
	.timeline-container:not(.show-icons) .timeline-dot {
		width: 1.5rem;
		height: 1.5rem;
		box-shadow: 0 0 0 3px var(--bg-color, #ffffff), 0 0 0 6px currentColor;
	}

	.timeline-container.compact .timeline-dot {
		width: 2rem;
		height: 2rem;
	}

	.timeline-container.compact:not(.show-icons) .timeline-dot {
		width: 1rem;
		height: 1rem;
		box-shadow: 0 0 0 2px var(--bg-color, #ffffff), 0 0 0 4px currentColor;
	}

	.timeline-icon {
		font-size: 1.25rem;
		filter: brightness(0) invert(1);
	}

	.timeline-container.compact .timeline-icon {
		font-size: 1rem;
	}

	.timeline-line {
		width: 2px;
		background: linear-gradient(to bottom, currentColor, var(--border-color, #E5E7EB));
		flex: 1;
		margin-top: 1rem;
		opacity: 0.3;
	}

	.timeline-content {
		flex: 1;
		background: var(--card-bg, #ffffff);
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		border: 1px solid var(--border-color, #E5E7EB);
		transition: all 0.3s ease;
		backdrop-filter: blur(8px);
		background: rgba(255, 255, 255, 0.8);
	}

	.timeline-container.compact .timeline-content {
		padding: 1rem;
	}

	.timeline-content:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	.timeline-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
		gap: 1rem;
	}

	.timeline-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-color, #1F2937);
		margin: 0;
		line-height: 1.4;
	}

	.timeline-container.compact .timeline-title {
		font-size: 1.125rem;
	}

	.timeline-title a {
		color: inherit;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.timeline-title a:hover {
		color: var(--primary-color, #3B82F6);
	}

	.timeline-date {
		color: var(--text-muted, #6B7280);
		font-size: 0.875rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.timeline-description {
		color: var(--text-secondary, #4B5563);
		line-height: 1.6;
		margin: 0 0 1rem 0;
	}

	.timeline-image {
		margin: 1rem 0;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.timeline-image img {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 0.3s ease;
	}

	.timeline-image img:hover {
		transform: scale(1.02);
	}

	.timeline-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.timeline-tag {
		font-size: 0.75rem;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		border: 1px solid;
		background: transparent;
		color: inherit;
		font-weight: 500;
		opacity: 0.8;
		transition: opacity 0.2s ease;
	}

	.timeline-tag:hover {
		opacity: 1;
	}

	/* Dark theme */
	.timeline-container.dark {
		--bg-color: #1F2937;
		--card-bg: #374151;
		--text-color: #F9FAFB;
		--text-secondary: #D1D5DB;
		--text-muted: #9CA3AF;
		--border-color: #4B5563;
		--primary-color: #60A5FA;
	}

	/* Animations */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.timeline-container {
			padding: 1rem;
		}

		.timeline-dot-container {
			margin-right: 1rem;
		}

		.timeline-dot {
			width: 2rem;
			height: 2rem;
		}

		.timeline-icon {
			font-size: 1rem;
		}

		.timeline-content {
			padding: 1rem;
		}

		.timeline-header {
			flex-direction: column;
			gap: 0.5rem;
		}

		.timeline-date {
			align-self: flex-start;
		}

		.year-label {
			font-size: 1.25rem;
			padding: 0.375rem 0.75rem;
		}
	}
</style>
