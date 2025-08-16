<script>
    import { ImageModal } from "$lib";
    import { Tv } from "lucide-svelte";
    import avatar from "$lib/assets/images/full/favicon.png";
    import avatarThumb from "$lib/assets/images/thumbnail/favicon.png";
</script>

<ImageModal image={avatar} thumbnail={avatarThumb}>
    <div slot="content">
        <p class="mb-3 font-semibold text-gray-800 text-lg">关于头像</p>
        <p class="mb-4 text-gray-700 text-sm leading-relaxed">
            这个可爱的魔理沙是我的同学画的
        </p>

        <!-- B站链接 -->
        <div
            class="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 px-3 py-2 rounded-lg transition-colors"
        >
            <Tv size={16} class="text-pink-600" />
            <a
                href="https://b23.tv/1lWBMKQ"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-pink-600 hover:text-pink-800 text-sm transition-colors"
            >
                音鹤莲的B站
            </a>
        </div>
    </div>
</ImageModal>
