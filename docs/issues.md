# Project Issues

This file tracks the initial issues derived from the launch plan and build steps.

## Launch plan

### Issue: Define release scope and MVP acceptance criteria
- Create `docs/launch-plan.md` describing MVP scope, target users, and success metrics.
- List acceptance criteria for MCP endpoints (create/read/update) and OAuth 2.0 authorization.
- Identify out-of-scope features for the first release.
- Add a milestone checklist for pre-release, release, and post-release tasks.

### Issue: Prepare release infrastructure and distribution strategy
- Decide plugin distribution path (WordPress.org vs. GitHub Releases).
- Add versioning policy (SemVer) and tag strategy in `docs/release.md`.
- Draft a `CHANGELOG.md` template and release checklist.
- Define support policy and contribution workflows for release branches.

### Issue: Create a clear installation and onboarding guide
- Add `docs/getting-started.md` with step-by-step installation, configuration, and first request.
- Include OAuth configuration examples with screenshots or sample settings.
- Provide sample MCP client calls with expected responses.
- Cross-link docs from `README.md`.

## Build steps

### Issue: Scaffold the WordPress plugin structure
- Create `plugin/wp-mcp.php` with plugin header and activation hook.
- Add an autoloader and basic folder layout (`includes/`, `admin/`, `public/`).
- Register a minimal admin settings page as a placeholder.
- Document structure in `docs/architecture.md`.

### Issue: Implement MCP REST endpoints for posts
- Register WordPress REST routes under `/wp-json/wp-mcp/v1/`.
- Implement handlers for `GET /posts`, `POST /posts`, and `PATCH /posts/{id}`.
- Ensure responses are consistent with MCP expectations (schema + error formats).
- Add permission checks and sanitize/validate all inputs.

### Issue: Add OAuth 2.0 Authorization Code flow support
- Choose an OAuth library or implement minimal OAuth server components.
- Create endpoints for authorize, token, and revoke.
- Store clients, secrets, and tokens securely (options table + encryption).
- Add configuration UI for OAuth clients in WordPress admin.

### Issue: Provide MCP client examples and SDK hints
- Add `docs/examples.md` with curl and minimal client scripts.
- Include example token exchange and authenticated MCP calls.
- Document error cases and troubleshooting tips.

### Issue: Testing and QA coverage for core flows
- Add unit tests for REST handlers and OAuth token exchange.
- Add integration tests using WordPress test suite.
- Provide a manual test checklist for install, auth, and MCP calls.
- Document how to run tests locally.

### Issue: Security review and hardening
- Perform a threat model for OAuth and REST endpoints.
- Add rate limiting and nonce/CSRF protections where relevant.
- Audit input validation and output escaping.
- Document security disclosures in `SECURITY.md`.
