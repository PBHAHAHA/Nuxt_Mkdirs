# Contributing Guide

Thank you for your interest in Nuxt Mkdirs! We welcome all forms of contributions.

## How to Contribute

### Reporting Bugs

If you find a bug, please submit it via [GitHub Issues](https://github.com/your-username/nuxt-mkdirs/issues) with the following information:

- Detailed description of the issue
- Steps to reproduce
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Environment info (OS, Node.js version, browser, etc.)

### Feature Requests

We welcome new feature suggestions! Please describe in Issues:

- Detailed explanation of the feature
- Why this feature is needed
- Possible implementation approach

### Submitting Code

1. **Fork the Repository**

   Click the Fork button in the top right corner.

2. **Clone Locally**

   ```bash
   git clone https://github.com/your-username/nuxt-mkdirs.git
   cd nuxt-mkdirs
   ```

3. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Install Dependencies**

   ```bash
   pnpm install
   ```

5. **Make Changes**

   Ensure your code:
   - Follows existing code style
   - Includes necessary comments
   - Updates relevant documentation

6. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add some feature"
   # or
   git commit -m "fix: fix some bug"
   ```

   Please follow [Conventional Commits](https://www.conventionalcommits.org/) specification:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation update
   - `style:` Code formatting (no functional changes)
   - `refactor:` Code refactoring
   - `test:` Test related
   - `chore:` Build/tooling related

7. **Push Branch**

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create Pull Request**

   Create a PR on GitHub describing your changes.

## Development Guide

### Project Structure

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

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

### Code Standards

- Use TypeScript
- Use Composition API
- Components use `<script setup>` syntax
- CSS uses TailwindCSS

## Code of Conduct

Please be kind and respectful. We are committed to providing an open and friendly environment for everyone.

## Questions?

If you have any questions, feel free to reach out:

- GitHub Issues
- WeChat: w314709923x

Thanks again for your contribution! 🎉
