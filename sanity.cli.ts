// Sanity CLI 配置
// 注意：此文件仅在单独运行 Sanity CLI 时使用（如 npx sanity dev）
// 部署后通过 /studio 路由访问时，使用的是 sanity.config.ts
const projectId = process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NUXT_PUBLIC_SANITY_DATASET || 'production';

export default {
  api: {
    projectId,
    dataset,
  },
};
