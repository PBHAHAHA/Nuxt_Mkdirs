<div align="center">

<img src="./public/logo.png" alt="Nuxt Mkdirs" width="120" />

# Nuxt Mkdirs

**开源的目录网站模板，基于 Nuxt 4 构建**

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat-square&logo=nuxt.js)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[English](./README.md) | [简体中文](./README.zh-CN.md)

[在线演示](https://demo.nuxt-mkdirs.com) · [配置文档](#%EF%B8%8F-配置指南) · [提交 Issue](https://github.com/PBHAHAHA/Nuxt_Mkdirs/issues)

</div>

---

## ✨ 特性

- 🎨 **3 种首页布局** - 多种风格可选，开箱即用
- 📦 **Sanity CMS** - 无头 CMS，无需配置数据库
- 🔐 **多种认证方式** - Google / GitHub OAuth 登录
- 💳 **支付集成** - 支持 Stripe 和 Creem（国内友好）
- 📧 **邮件服务** - Resend 邮件发送 + Newsletter
- 🤖 **AI 智能填充** - AI 自动提取网站信息
- 🌙 **深色模式** - 自动跟随系统主题
- 📱 **响应式设计** - 完美适配移动端
- ⚡ **NuxtHub 部署** - 一键部署到 Cloudflare

## 📸 截图

![首页截图](./public/docsimg/home.png)

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Nuxt 4, Vue 3 |
| 样式 | TailwindCSS 4, Radix Vue |
| CMS | Sanity |
| 认证 | Auth.js |
| 支付 | Stripe, Creem |
| 邮件 | Resend |
| 部署 | NuxtHub (Cloudflare) |

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装

```bash
# 克隆项目
git clone https://github.com/PBHAHAHA/Nuxt_Mkdirs.git
cd Nuxt_Mkdirs

# 安装依赖
pnpm install

# 复制环境变量
cp .env.example .env

# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000 查看效果。

### 构建部署

```bash
# 构建生产版本
pnpm build

# 本地预览
pnpm preview
```

## 🚀 部署

本项目使用 NuxtHub v0.10+ 和 Cloudflare Workers。

> ⚠️ **注意**: NuxtHub Admin 部署方式将于 2024 年 12 月 31 日停用，请使用 Wrangler 进行部署。

### 使用 Wrangler 部署

1. 复制 wrangler 配置文件：

```bash
cp wrangler.example.jsonc wrangler.jsonc
```

2. 编辑 `wrangler.jsonc`，填入你的环境变量。

3. 构建并部署：

```bash
pnpm build
npx wrangler deploy
```

部署后网站地址为 `https://nuxt-mkdirs.<your-account>.workers.dev`。

如需绑定自定义域名，请在 [Cloudflare Dashboard](https://dash.cloudflare.com/) > Workers & Pages > 你的项目 > Settings > Domains & Routes 中配置。

## ⚙️ 配置指南

### 1. Sanity CMS 配置

Nuxt Mkdirs 使用 [Sanity](https://www.sanity.io/) 作为无头 CMS，管理所有内容数据。

1. 创建 [Sanity 账号](https://www.sanity.io/signup)
2. 创建新项目，获取 Project ID
3. 创建 API Token（权限选择 Editor）
4. 配置 CORS origins

![Sanity CORS配置](./public/docsimg/sanity%20cors.PNG)

```bash
# .env 配置
NUXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NUXT_PUBLIC_SANITY_DATASET=production
NUXT_SANITY_API_TOKEN=your_api_token
```

5. 部署 Sanity Studio

```bash
pnpm dlx sanity deploy
```

![Sanity Studio](./public/docsimg/sanity%20studio.png)

### 2. 邮件配置 (Resend)

1. 创建 [Resend 账号](https://resend.com/)
2. 添加并验证你的域名
3. 创建 API Key

![Resend API Key](./public/docsimg/resend.png)

4. 配置 Audience ID（用于 Newsletter）

![Resend Audience](./public/docsimg/resend%202.png)
![Resend Audience ID](./public/docsimg/resend%203.png)

```bash
# .env 配置
NUXT_RESEND_API_KEY=re_xxxxx
NUXT_RESEND_EMAIL_FROM=noreply@yourdomain.com
NUXT_RESEND_AUDIENCE_ID=xxxxx
```

### 3. 支付配置

#### Stripe（国际支付）

```bash
NUXT_STRIPE_SECRET_KEY=sk_xxxxx
NUXT_STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxxxx
```

#### Creem（国内友好）

[Creem](https://creem.io/) 支持国内身份证注册，对国内开发者更友好。

```bash
NUXT_CREEM_API_KEY=xxxxx
NUXT_CREEM_WEBHOOK_SECRET=xxxxx
NUXT_CREEM_TEST_MODE=true
NUXT_PUBLIC_CREEM_PRO_PRODUCT_ID=xxxxx
```

### 4. OAuth 认证配置

#### Google OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. 创建 OAuth 客户端 ID

![Google Credentials](./public/docsimg/google%201.png)
![Google OAuth 创建](./public/docsimg/google2.png)
![Google OAuth 配置](./public/docsimg/google3.png)

```bash
# .env 配置
NUXT_AUTH_GOOGLE_CLIENT_ID=xxxxx
NUXT_AUTH_GOOGLE_CLIENT_SECRET=xxxxx
```

#### GitHub OAuth

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建 OAuth App

```bash
NUXT_AUTH_GITHUB_CLIENT_ID=xxxxx
NUXT_AUTH_GITHUB_CLIENT_SECRET=xxxxx
```

#### Auth Secret

```bash
# 生成密钥
openssl rand -base64 32

# .env 配置
NUXT_AUTH_SECRET=your_generated_secret
```

### 5. AI 配置（可选）

启用 AI 智能填充功能，自动提取网站信息。

```bash
# 选择 AI 提供商: google, deepseek, openai
NUXT_AI_PROVIDER=google

# Google Generative AI (https://aistudio.google.com/apikey)
NUXT_GOOGLE_AI_API_KEY=xxxxx

# DeepSeek (https://platform.deepseek.com/api_keys)
NUXT_DEEPSEEK_API_KEY=xxxxx

# OpenAI (https://platform.openai.com/settings/organization/api-keys)
NUXT_OPENAI_API_KEY=xxxxx
```

配置后，用户可以点击“AI 自动填充”按钮，自动：
- 提取网站名称和描述
- 生成详细介绍
- 下载并上传 Logo/图片
- 智能推荐分类和标签

## 📁 项目结构

```
nuxt-mkdirs/
├── app/
│   ├── components/     # Vue 组件
│   ├── composables/    # 组合式函数
│   ├── layouts/        # 布局组件
│   ├── pages/          # 页面路由
│   └── utils/          # 工具函数
├── server/
│   ├── api/            # API 路由
│   └── utils/          # 服务端工具
├── sanity/
│   └── schemas/        # Sanity Schema
└── public/             # 静态资源
```

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

## 💖 支持项目

如果这个项目对你有帮助，欢迎：

- ⭐ 给项目点个 Star
- 📢 分享给更多人
- <a href="https://www.buymeacoffee.com/pubing967" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;" ></a>

## 📮 联系方式

- 微信: w314709923x
- GitHub: [@PBHAHAHA](https://github.com/PBHAHAHA)
<!-- ![](./public/docsimg/wepay.jpg) -->
---

<div align="center">
  Made with ❤️ by <a href="https://github.com/PBHAHAHA">PBHAHAHA</a>
</div>
