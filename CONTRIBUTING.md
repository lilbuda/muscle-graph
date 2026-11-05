# Contributing

Contributions to muscle-graph are welcome. Open an issue before starting a large feature or changing the anatomy artwork so we can agree on scope.

## Development

Use Node.js 22.12 or newer and npm. Fork the repository, clone your fork, and create a focused branch such as `fix/calf-selection` or `feature/new-option`.

```sh
npm ci
npm run dev
```

The documentation website includes a live showcase. Use `npm run dev:playground` for the standalone playground.

## Project layout

- `src/` contains the framework-agnostic library and licensed anatomy data.
- `website/` contains the documentation, guides, and showcase.
- `examples/playground/` contains the standalone demo.
- `test/` contains runtime, anatomy, and documentation regression tests.
- `scripts/` contains build and package validation tools.

## Making a change

Keep changes focused and preserve the public API unless a breaking change has been agreed upon. Use strict TypeScript, maintain keyboard accessibility, and avoid adding runtime dependencies. Add regression coverage for behavior changes and update the relevant guides when the API changes.

For anatomy changes, inspect male and female figures from both sides and verify that highlights and pointer targets match the visible regions. Preserve the upstream attribution and permission notice when editing SVG data.

Before opening a pull request, run the following checks.

```sh
npm run check
npm run security
npm pack --dry-run
```

## Pull requests

Target `main`. Use a Conventional Commit title such as `fix(anatomy): correct calf selection`. Explain the problem, the resulting behavior, and how you verified it. Include screenshots for visual changes and clearly identify breaking changes.

Address review comments and keep your branch current with `main`. Maintainers squash merge accepted pull requests after CI passes. Commit messages should be concise, imperative, and use an appropriate type such as `feat`, `fix`, `docs`, `test`, or `chore`.

## Reporting problems

Use the bug report or feature request templates. Include the package version, browser, framework if relevant, and a minimal reproduction. Follow the security policy for sensitive reports.

Contributions are distributed under the repository's MIT license. See [LICENSE](LICENSE), [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), [SECURITY.md](SECURITY.md), and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
