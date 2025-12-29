# WP MCP Bridge

This WordPress plugin exposes a REST endpoint that proxies AI generation requests to the MCP HTTP bridge.

## Install
1. Copy `wp-mcp-bridge` into your WordPress `wp-content/plugins` directory.
2. Activate **WP MCP Bridge** in the WordPress admin.
3. Go to **Settings → WP MCP Bridge** and set the MCP bridge URL.

## REST endpoint
`POST /wp-json/wp-mcp/v1/generate`

Payload:
```json
{
  "title": "Example",
  "outline": "Optional outline",
  "keywords": ["ai", "wordpress"],
  "language": "sv"
}
```

The endpoint requires `edit_posts` capability.
