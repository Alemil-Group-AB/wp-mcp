# wp-mcp
MCP server for create, edit and delete posts in your WordPress website, with optional AI-generated drafts.

## Quick start
1. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

2. Configure environment variables:
   ```bash
   export WORDPRESS_URL="https://example.com"
   export WORDPRESS_USER="admin"
   export WORDPRESS_APP_PASSWORD="xxxx xxxx xxxx xxxx"
   ```

3. Run the MCP server:
   ```bash
   npm start
   ```

## Tools
- `create_post`: Creates a post in WordPress.
- `update_post`: Updates a post.
- `delete_post`: Deletes a post.
- `generate_post`: Generates a draft using the configured AI provider.

## HTTP bridge (optional)
If you want a WordPress plugin or external system to call the AI generator over HTTP, set `HTTP_PORT`.

```bash
export HTTP_PORT=8080
npm start
```

Endpoints:
- `GET /health`
- `POST /generate`

## WordPress plugin (optional)
The `wp-plugin/wp-mcp-bridge` folder contains a small plugin that calls the HTTP bridge. Install it
inside `wp-content/plugins` and configure the bridge URL in WordPress settings.

## AI provider integration
The server ships with a `NullAIProvider` that just echoes data. Replace it by injecting an `AIProvider`
implementation and passing it to `startServer` in `src/index.ts`.

## Notes
- Requires WordPress REST API access and an application password.
- App passwords are stored only in environment variables.
