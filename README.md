<div align="center">

<img src="./public/logo.png" alt="Nuxt Mkdirs" width="120" />

# Nuxt Mkdirs

**Open-source directory website template built with Nuxt 4**

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat-square&logo=nuxt.js)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[English](./README.md) | [简体中文](./README.zh-CN.md)

[Live Demo](https://demo.nuxt-mkdirs.com) · [Documentation](#-configuration-guide) · [Report Bug](https://github.com/PBHAHAHA/Nuxt_Mkdirs/issues)

</div>

---

## ✨ Features

- 🎨 **3 Homepage Layouts** - Multiple styles, ready to use out of the box
- 📦 **Sanity CMS** - Headless CMS, no database configuration needed
- 🔐 **Multiple Auth Methods** - Google / GitHub OAuth login
- 💳 **Payment Integration** - Supports Stripe and Creem
- 📧 **Email Service** - Resend for transactional emails + Newsletter
- 🤖 **AI Auto-fill** - Automatically extract website info with AI
- 🌙 **Dark Mode** - Auto-follows system theme
- 📱 **Responsive Design** - Perfect mobile adaptation
- ⚡ **NuxtHub Deploy** - One-click deploy to Cloudflare

## 📸 Screenshot

![Homepage](./public/docsimg/home.png)

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Nuxt 4, Vue 3 |
| Styling | TailwindCSS 4, Radix Vue |
| CMS | Sanity |
| Auth | Auth.js |
| Payment | Stripe, Creem |
| Email | Resend |
| Deploy | NuxtHub (Cloudflare) |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/PBHAHAHA/Nuxt_Mkdirs.git
cd Nuxt_Mkdirs

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

Visit http://localhost:3000 to see the result.

### Build & Deploy

```bash
# Build for production
pnpm build

# Preview locally
pnpm preview
```

## 🚀 Deployment

This project uses NuxtHub v0.10+ with Cloudflare Workers.

> ⚠️ **Note**: NuxtHub Admin deployment will be deprecated on December 31, 2024. Please use Wrangler for deployment.

### Deploy with Wrangler

1. Copy the wrangler configuration:

```bash
cp wrangler.example.jsonc wrangler.jsonc
```

2. Edit `wrangler.jsonc` and fill in your environment variables.

3. Build and deploy:

```bash
pnpm build
npx wrangler deploy
```

Your site will be deployed to `https://nuxt-mkdirs.<your-account>.workers.dev`.

To use a custom domain, configure it in [Cloudflare Dashboard](https://dash.cloudflare.com/) > Workers & Pages > your project > Settings > Domains & Routes.

## ⚙️ Configuration Guide

### 1. Sanity CMS Setup

Nuxt Mkdirs uses [Sanity](https://www.sanity.io/) as a headless CMS to manage all content data.

1. Create a [Sanity account](https://www.sanity.io/signup)
2. Create a new project and get the Project ID
3. Create an API Token (select Editor permission)
4. Configure CORS origins

![Sanity CORS Configuration](./public/docsimg/sanity%20cors.PNG)

```bash
# .env configuration
NUXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NUXT_PUBLIC_SANITY_DATASET=production
NUXT_SANITY_API_TOKEN=your_api_token
```

5. Deploy Sanity Studio

```bash
pnpm dlx sanity deploy
```

![Sanity Studio](./public/docsimg/sanity%20studio.png)

### 2. Email Setup (Resend)

1. Create a [Resend account](https://resend.com/)
2. Add and verify your domain
3. Create an API Key

![Resend API Key](./public/docsimg/resend.png)

4. Configure Audience ID (for Newsletter)

![Resend Audience](./public/docsimg/resend%202.png)
![Resend Audience ID](./public/docsimg/resend%203.png)

```bash
# .env configuration
NUXT_RESEND_API_KEY=re_xxxxx
NUXT_RESEND_EMAIL_FROM=noreply@yourdomain.com
NUXT_RESEND_AUDIENCE_ID=xxxxx
```

### 3. Payment Setup

#### Stripe (International)

```bash
NUXT_STRIPE_SECRET_KEY=sk_xxxxx
NUXT_STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxxxx
```

#### Creem (China-friendly)

[Creem](https://creem.io/) supports registration with Chinese ID, more friendly for Chinese developers.

```bash
NUXT_CREEM_API_KEY=xxxxx
NUXT_CREEM_WEBHOOK_SECRET=xxxxx
NUXT_CREEM_TEST_MODE=true
NUXT_PUBLIC_CREEM_PRO_PRODUCT_ID=xxxxx
```

### 4. OAuth Authentication Setup

#### Google OAuth

1. Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth Client ID

![Google Credentials](./public/docsimg/google%201.png)
![Google OAuth Create](./public/docsimg/google2.png)
![Google OAuth Config](./public/docsimg/google3.png)

```bash
# .env configuration
NUXT_AUTH_GOOGLE_CLIENT_ID=xxxxx
NUXT_AUTH_GOOGLE_CLIENT_SECRET=xxxxx
```

#### GitHub OAuth

1. Visit [GitHub Developer Settings](https://github.com/settings/developers)
2. Create an OAuth App

```bash
NUXT_AUTH_GITHUB_CLIENT_ID=xxxxx
NUXT_AUTH_GITHUB_CLIENT_SECRET=xxxxx
```

#### Auth Secret

```bash
# Generate secret
openssl rand -base64 32

# .env configuration
NUXT_AUTH_SECRET=your_generated_secret
```

### 5. AI Configuration (Optional)

Enable AI-powered auto-fill feature for website submissions.

```bash
# Choose AI provider: google, deepseek, openai
NUXT_AI_PROVIDER=google

# Google Generative AI (https://aistudio.google.com/apikey)
NUXT_GOOGLE_AI_API_KEY=xxxxx

# DeepSeek (https://platform.deepseek.com/api_keys)
NUXT_DEEPSEEK_API_KEY=xxxxx

# OpenAI (https://platform.openai.com/settings/organization/api-keys)
NUXT_OPENAI_API_KEY=xxxxx
```

When configured, users can click the "AI Auto-fill" button to automatically:
- Extract website name and description
- Generate detailed introduction
- Download and upload logo/images
- Suggest categories and tags

## 📁 Project Structure

```
nuxt-mkdirs/
├── app/
│   ├── components/     # Vue components
│   ├── composables/    # Composables
│   ├── layouts/        # Layout components
│   ├── pages/          # Page routes
│   └── utils/          # Utility functions
├── server/
│   ├── api/            # API routes
│   └── utils/          # Server utilities
├── sanity/
│   └── schemas/        # Sanity schemas
└── public/             # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT](LICENSE) License.

## 💖 Support

If this project helps you, please consider:

- ⭐ Give it a Star
- 🐛 Submit Issues
- 📢 Share with others
- <a href="https://www.buymeacoffee.com/pubing967" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;" ></a>


## 📮 Contact

<!-- - WeChat: w314709923x -->
- GitHub: [@PBHAHAHA](https://github.com/PBHAHAHA)


---

<div align="center">
  Made with ❤️ by <a href="https://github.com/PBHAHAHA">PBHAHAHA</a>
</div>
