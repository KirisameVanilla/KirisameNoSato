<script lang="ts">
  import { Copy, Check } from "lucide-svelte";
  
  export let code: string;
  
  let copied = false;
  
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  }
</script>

<div class="bg-gray-50 mb-4 p-4 rounded not-prose">
  <div class="code-container">
    <button on:click={copyCode} class="copy-button">
      {#if copied}
        <Check class="inline mr-1 w-3 h-3" /> 已复制
      {:else}
        <Copy class="inline mr-1 w-3 h-3" /> 复制
      {/if}
    </button>
    <pre><code>{code}</code></pre>
  </div>
</div>

<style>
  /* 重置 not-prose 样式但保持基本布局 */
  .not-prose {
    display: block;
  }
  
  .not-prose * {
    all: revert;
  }
  
  /* 代码块容器 */
  .not-prose .code-container {
    position: relative;
    background-color: #1f2937;
    border-radius: 0.375rem;
    overflow: hidden;
  }
  
  /* 确保代码块正确显示换行 */
  .not-prose pre {
    display: block;
    margin: 0;
    padding: 0.75rem;
    background-color: transparent;
    border-radius: 0;
    overflow-x: auto;
  }
  
  .not-prose pre code {
    display: block;
    color: #f3f4f6;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Courier New', Consolas, monospace;
  }
  
  /* 复制按钮样式 - 悬浮在代码块内 */
  .not-prose .copy-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: inline-flex;
    align-items: center;
    background-color: rgba(37, 99, 235, 0.8);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    border: none;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: background-color 0.2s;
  }
  
  .not-prose .copy-button:hover {
    background-color: rgba(29, 78, 216, 0.9);
  }
</style>
