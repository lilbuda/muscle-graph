# Repository maintenance

## Main branch protection

The checked-in protection configuration requires pull requests, an up-to-date branch, the `test` check from GitHub Actions, resolved conversations, and linear history. It applies to administrators and blocks force pushes and branch deletion.

This repository currently has one maintainer, so the configuration requires zero additional approvals. The maintainer can merge their own pull requests once CI passes. CODEOWNERS requests @lilbuda for reviews of contributions. Increase `required_approving_review_count` to one when another trusted reviewer is available.

GitHub Free supports this protection for public repositories. A private repository requires an eligible paid plan. Once eligible, apply the configuration from the repository root with an authenticated GitHub CLI.

```sh
gh api --method PUT repos/lilbuda/muscle-graph/branches/main/protection --input .github/branch-protection.json
```

The JSON file is a configuration snapshot. GitHub applies it only when the API command runs. Keep the required check name in sync with the CI job identifier. The app ID `15368` restricts the required check to GitHub Actions.

## Public repository security

Enable private vulnerability reporting once the repository is public, and confirm that the form linked in SECURITY.md opens successfully.

```sh
gh api --method PUT repos/lilbuda/muscle-graph/private-vulnerability-reporting
```

Enable secret scanning and push protection in the repository's security settings when available. Keep Dependabot alerts and security updates enabled, review dependency PRs, and investigate failing security audits before merging.

## Merging and releases

Use squash merging and Conventional Commit PR titles. CI uses a read-only token, immutable GitHub Action revisions, and no stored checkout credentials. Dependabot opens PRs for dependency and Action updates.

Before an npm release, update the package version, run `npm run check` and `npm run security`, inspect `npm pack --dry-run`, and verify the README and third-party notice. Publish through an npm account with two-factor authentication or a separately reviewed trusted publishing workflow.
