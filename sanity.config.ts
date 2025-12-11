import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { markdownSchema } from 'sanity-plugin-markdown';
import { schemaTypes } from './sanity/schemas';

// 从环境变量读取（Nuxt 会自动注入 NUXT_PUBLIC_* 到 process.env）
const projectId = process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NUXT_PUBLIC_SANITY_DATASET || 'production';

// 调试：检查环境变量是否正确加载（确认后可删除）
console.log('[Sanity Config] projectId:', projectId || '❌ 未设置');
console.log('[Sanity Config] dataset:', dataset);
const apiVersion = '2024-01-01';

export default defineConfig({
  name: 'Studio',
  basePath: '/studio',
  projectId,
  dataset,

  schema: {
    types: schemaTypes,
  },

  plugins: [
    structureTool(),
    visionTool({
      title: 'Query',
      defaultApiVersion: apiVersion,
      defaultDataset: dataset,
    }),
    markdownSchema(),
  ],
});
