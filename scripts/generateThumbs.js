// scripts/generateThumbs.js
import { readdir, mkdir } from 'fs/promises';
import sharp from 'sharp';
import path from 'path';

const srcDir = './src/lib/assets/images/full';     // 原图存放路径
const thumbDir = './src/lib/assets/images/thumbnail';  // 缩略图输出路径
const thumbSize = 200; // 缩略图最大宽度

async function generateThumbnails() {
  try {
    await mkdir(thumbDir, { recursive: true });

    const files = await readdir(srcDir);
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    for (const file of imageFiles) {
      const inputPath = path.join(srcDir, file);
      const outputPath = path.join(thumbDir, file);

      await sharp(inputPath)
        .resize(thumbSize, null, { fit: 'inside', withoutEnlargement: true })
        .toFormat('jpeg', { quality: 80 })
        .toFile(outputPath);

      console.log(`✅ 缩略图生成: ${file}`);
    }

    console.log('🎉 所有缩略图生成完成！');
  } catch (err) {
    console.error('❌ 生成失败:', err);
  }
}

generateThumbnails();