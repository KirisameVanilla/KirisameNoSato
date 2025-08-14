<script lang="ts">
  import { fade, scale } from "svelte/transition";

  export let image: string;

  let showModal = false;

  const openModal = () => {
    showModal = true;
  };

  const closeModal = () => {
    showModal = false;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };
</script>

<div class="relative">
  <button class="focus:outline-none" on:click={openModal}>
    <img
      class="shadow border-2 border-blue-100 rounded-full w-24 h-24 cursor-pointer"
      src={image}
      alt="点击查看大图"
    />
  </button>

  {#if showModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="z-50 fixed inset-0 flex justify-center items-center bg-transparent bg-opacity-30 backdrop-blur-sm"
      transition:fade
      on:click={closeModal}
      on:keydown={handleKeydown}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div
        class="flex bg-white shadow-lg p-6 rounded-lg max-w-5xl"
        transition:scale
        on:click|stopPropagation
        role="document"
      >
        <!-- 左侧：图片 -->
        <div class="flex-shrink-0 mr-6">
          <img class="rounded-lg w-96 h-auto" src={image} alt="放大图片" />
        </div>

        <!-- 右侧：内容和按钮 -->
        <div class="flex flex-col flex-1 justify-between">
          <!-- 右侧顶部的内容区域 -->
          <div class="max-w-xl">
            <slot name="content">
              <!-- 默认内容为空 -->
            </slot>
          </div>

          <!-- 右侧底部的关闭按钮 -->
          <div class="w-full">
            <button
              class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-full text-white transition-colors"
              on:click={closeModal}
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* 可根据需要添加样式 */
</style>
