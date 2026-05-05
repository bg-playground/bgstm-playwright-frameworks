# Contributing to BGSTM Playwright Frameworks

Thank you for your interest in contributing to BGSTM Playwright Frameworks! We welcome contributions from the community to help make these domain-specific Playwright automation frameworks even better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Contact](#contact)

## 🤝 Code of Conduct

This project adheres to our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior by opening a GitHub issue or reaching out to the maintainers.

## 🎯 How Can I Contribute?

There are many ways to contribute:

### 1. New Domain Packs
- Propose a new domain pack via a [Domain Pack Proposal](./.github/ISSUE_TEMPLATE/domain-pack-proposal.yml) issue
- Implement page objects, factories, and flows for a new domain
- Add exemplar tests and a README for your domain pack

### 2. Core Framework Improvements
- Improve the base reporter, fixtures, or POM utilities
- Enhance TypeScript types and generics
- Performance and reliability improvements

### 3. Documentation
- Fix typos, grammar, or formatting
- Improve the getting-started guide or BGSTM integration docs
- Add examples and recipes

### 4. Bug Reports & Feature Requests
- Report bugs with a clear reproduction case
- Suggest new features or improvements via GitHub Issues

### 5. Community Support
- Answer questions in issues and discussions
- Review open pull requests

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm@9`)
- Git

### Setting Up Your Development Environment

1. **Fork the Repository**
   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/YOUR-USERNAME/bgstm-playwright-frameworks.git
   cd bgstm-playwright-frameworks
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

4. **Build all packages**
   ```bash
   pnpm build
   ```

5. **Run tests**
   ```bash
   pnpm test
   ```

6. **Run lint and type checks**
   ```bash
   pnpm lint
   pnpm typecheck
   ```

## 📝 Pull Request Process

### Before Submitting

1. **Check Existing Issues/PRs**: Make sure your contribution isn't already being addressed
2. **Open an issue first** for significant changes (new domain packs, breaking API changes)
3. **Test Thoroughly**: Verify all changes work as expected and tests pass
4. **Add a changeset**: Run `pnpm changeset` and follow the prompts to describe your change

### Submitting Your PR

1. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: brief description of your changes"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `chore:` for tooling/config changes
   - `test:` for test-only changes

2. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request** against the `main` branch with:
   - A clear title and description
   - Reference to any related issues
   - Notes on how you tested your changes

### PR Requirements

- ✅ All CI checks passing (lint, typecheck, tests)
- ✅ A changeset added (run `pnpm changeset`)
- ✅ Follows style guidelines
- ✅ Includes or updates relevant documentation

## 📐 Style Guidelines

- **TypeScript**: Strict mode enabled. All public API surfaces must be typed.
- **Formatting**: Prettier handles formatting — run `pnpm prettier --write .` before committing.
- **Linting**: ESLint with TypeScript rules — run `pnpm lint` to check.
- **File naming**: `kebab-case` for files, `PascalCase` for classes, `camelCase` for functions.
- **Imports**: Use named exports; avoid default exports in library code.

## 🐛 Issue Reporting Guidelines

### Bug Reports

Use the [Bug Report](./.github/ISSUE_TEMPLATE/bug-report.yml) issue template and include:
- A clear description of the issue
- Steps to reproduce
- Expected vs. actual behaviour
- Environment details (Node version, pnpm version, OS)
- Minimal reproduction code if possible

### New Domain Pack Proposals

Use the [Domain Pack Proposal](./.github/ISSUE_TEMPLATE/domain-pack-proposal.yml) template before starting implementation work.

## 💬 Contact

- **Issues**: For bugs, features, or improvements
- **Discussions**: For questions and community discussions

## 🎉 Recognition

All contributors are recognised in the project's changelog and releases. We value every contribution, no matter how small!

## 📚 Additional Resources

- [README](README.md) — Project overview
- [Getting Started](./docs/getting-started.md) — Developer guide
- [BGSTM Integration](./docs/bgstm-integration.md) — How the reporter wires into BGSTM
- [Writing a Domain Pack](./docs/writing-a-domain-pack.md) — Guide for creating new domain packs
- [BGSTM](https://github.com/bg-playground/BGSTM) — Methodology + traceability platform

---

**Happy Contributing!** 🚀
