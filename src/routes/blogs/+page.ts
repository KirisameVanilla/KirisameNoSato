import type { PageLoad } from './$types';

// 动态导入所有 posts 目录下的 svelte 文件
const modules = import.meta.glob('../blogs/posts/*.svelte');

export const load: PageLoad = async () => {
  const posts = await Promise.all(
    Object.entries(modules).map(async ([path, resolver]) => {
      const mod: any = await resolver();
      // 提取 metadata（frontmatter）
      return {
        ...mod.metadata,
        // 生成 slug 方便跳转
        slug: path.split('/').pop()?.replace('.svelte', '')
      };
    })
  );
  // 按日期降序排序（假设 metadata 里有 date 字段）
  posts.sort((a, b) => (b.date && a.date) ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0);
  // 统计所有 tags 及其出现次数
  const tagMap: Record<string, number> = {};
  posts.forEach(post => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    }
  });
  const tags = Object.keys(tagMap);
  // 出现次数最多的前5个tag
  const topTags = tags
    .map(tag => ({ tag, count: tagMap[tag] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  return { posts, tags, topTags };
};
