<script lang="ts">
  import { Calendar, Clock, Tag } from "lucide-svelte";
  
  export let date: string;
  export let readTime: string;
  export let tags: string[] = [];

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    });
  }
</script>

<header class="mb-8">
  <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
    <div class="flex items-center space-x-4 text-gray-500 text-sm">
      <div class="flex items-center">
        <Calendar class="mr-2 w-4 h-4" />
        <span>{formatDate(date)}</span>
      </div>
      <div class="flex items-center">
        <Clock class="mr-2 w-4 h-4" />
        <span>{readTime}</span>
      </div>
    </div>
  </div>

  <div class="flex flex-wrap gap-2 mb-6">
    {#each tags as tag (tag)}
      <span class="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm">
        <Tag class="inline-block mr-1 w-3 h-3" />
        {tag}
      </span>
    {/each}
  </div>
</header>
