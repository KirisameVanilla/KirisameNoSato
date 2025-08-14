import { error } from '@sveltejs/kit';

const modules = import.meta.glob('../posts/*.svelte');

export const load = async ({ params }: { params: { slug: string } }) => {
	const slug = params.slug;
	let found = null;
	for (const [path, resolver] of Object.entries(modules)) {
		// 支持 hello-world、HelloWorld 两种 slug
		const fileName = path.split('/').pop()?.replace('.svelte', '').toLowerCase();
		if (fileName === slug.toLowerCase()) {
			const mod: any = await resolver();
			found = {
				...mod.metadata,
				slug,
				component: mod.default
			};
			break;
		}
	}
	if (!found) {
		throw error(404, { message: '文章不存在' });
	}
	return { post: found };
};
