# Security policy

## Supported versions

Security fixes target the latest published version. Upgrade to that version when a fix becomes available.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting form on the repository's Security tab. Include the affected version, a minimal reproduction, the impact, and any proposed fix.

If private reporting is unavailable, open an issue titled "Private security contact requested" with a request for a private reporting channel. Share sensitive details only through the private channel arranged with the maintainer.

The maintainer will assess the report and coordinate a fix and disclosure with you. Response times depend on maintainer availability.

[Report a vulnerability](https://github.com/lilbuda/muscle-graph/security/advisories/new)

## Scope and handling application data

Reports concerning the published library, documentation site, or build and release tooling are welcome. The library renders exercise data through DOM APIs and returns exercise names as strings in callbacks. Applications should render those strings as text and validate external workout data. Styling options and callbacks are application-controlled configuration.

## Checks

CI runs dependency audits, strict type checks, regression tests, and production package validation. Run `npm run security` locally to check the installed dependency tree against npm's known advisories.
