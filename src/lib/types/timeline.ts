// Timeline 组件的类型定义

export interface TimelineEvent {
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

export type TimelineTheme = 'light' | 'dark';

export interface TimelineProps {
	events: TimelineEvent[];
	theme?: TimelineTheme;
	showIcons?: boolean;
	showYears?: boolean;
	compact?: boolean;
}
