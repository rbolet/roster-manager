# Contributing to Roster Manager

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/roster-manager.git`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Code Quality Standards

### TypeScript

- Use strict TypeScript mode
- Avoid `any` types
- Use type inference where possible
- Use `type` over `interface` for consistency

### Code Style

- Follow the ESLint and Prettier configurations
- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex logic

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or tooling changes
- `ci`: CI/CD changes

**Examples:**
```
feat(auth): Add JWT refresh token rotation
fix(api): Handle database connection errors
docs: Update README with deployment instructions
```

## Pull Request Process

1. **Create a PR** with a clear title and description
2. **Link related issues** in the PR description
3. **Ensure all tests pass** - CI will run automatically
4. **Request review** from maintainers
5. **Address feedback** and push updates
6. **Squash and merge** once approved

## Testing Requirements

- Write unit tests for new features
- Update existing tests if behavior changes
- Ensure E2E tests cover critical user flows
- Maintain >80% code coverage

## Architecture Guidelines

### Loose Coupling

- Keep frontend and backend independent
- Use the contracts package for shared types
- Avoid tight framework coupling

### Layered Architecture (Backend)

```
Controllers → Services → Repositories → Database
```

- **Controllers** - HTTP request handling
- **Services** - Business logic
- **Repositories** - Data access layer

### Feature-Based Structure (Frontend)

```
features/
  auth/
    components/
    hooks/
    api/
```

Group related code by feature, not by type.

## Questions?

Open an issue or reach out to the maintainers.

Thank you for contributing! 🎉
