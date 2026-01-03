# Releases & Tags 🔖

This repository uses **Semantic Release** to automatically create tags and GitHub Releases on pushes/merges to `main`.

How it works

- The GitHub Action `.github/workflows/release.yml` runs on `push` to `main` (and manually via `workflow_dispatch`).
- Commit messages must follow **Conventional Commits** (e.g., `feat: add login`, `fix: correct typo`, `feat!: breaking change`) so Semantic Release can determine whether to bump **major**, **minor**, or **patch**.
- Tags are created in the format `v<major>.<minor>.<patch>` (for example `v1.2.3`). A GitHub Release with the same tag is published automatically.

Conventional Commit examples

- `feat: add two-factor auth` → minor bump
- `fix: correct email validation` → patch bump
- `refactor!: change the API contract (BREAKING CHANGE: ... )` → major bump

Notes & Permissions

- The workflow uses `GITHUB_TOKEN` to create tags and releases. Ensure Actions in your repository have permission to create content (the workflow already sets `permissions: contents: write`).
- The `CHANGELOG.md` will be updated by the release process.

If you'd like, I can:

- Add `semantic-release` devDependencies to `package.json` instead of relying on the action to install plugins, or
- Open a branch and PR with these changes so you can review before merging.
