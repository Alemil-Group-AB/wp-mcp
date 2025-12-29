<?php
/**
 * Plugin Name: WP MCP Bridge
 * Description: Connects WordPress to an external MCP HTTP bridge for AI content generation.
 * Version: 0.1.0
 * Author: wp-mcp
 */

if (!defined('ABSPATH')) {
    exit;
}

const WP_MCP_OPTION_URL = 'wp_mcp_bridge_url';

function wp_mcp_register_settings() {
    register_setting('wp_mcp_settings', WP_MCP_OPTION_URL, [
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => '',
    ]);

    add_settings_section('wp_mcp_main', 'MCP Bridge', '__return_false', 'wp_mcp_settings');

    add_settings_field(
        'wp_mcp_bridge_url',
        'MCP Bridge URL',
        'wp_mcp_bridge_url_field',
        'wp_mcp_settings',
        'wp_mcp_main'
    );
}
add_action('admin_init', 'wp_mcp_register_settings');

function wp_mcp_bridge_url_field() {
    $value = esc_url(get_option(WP_MCP_OPTION_URL));
    echo '<input type="url" name="' . esc_attr(WP_MCP_OPTION_URL) . '" value="' . esc_attr($value) . '" class="regular-text" placeholder="https://mcp.example.com" />';
}

function wp_mcp_register_menu() {
    add_options_page('WP MCP Bridge', 'WP MCP Bridge', 'manage_options', 'wp-mcp-bridge', 'wp_mcp_render_settings');
}
add_action('admin_menu', 'wp_mcp_register_menu');

function wp_mcp_render_settings() {
    ?>
    <div class="wrap">
        <h1>WP MCP Bridge</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('wp_mcp_settings');
            do_settings_sections('wp_mcp_settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

function wp_mcp_register_routes() {
    register_rest_route('wp-mcp/v1', '/generate', [
        'methods' => 'POST',
        'callback' => 'wp_mcp_generate_post',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
    ]);
}
add_action('rest_api_init', 'wp_mcp_register_routes');

function wp_mcp_generate_post(WP_REST_Request $request) {
    $bridge_url = get_option(WP_MCP_OPTION_URL);
    if (!$bridge_url) {
        return new WP_REST_Response(['error' => 'Bridge URL not configured'], 400);
    }

    $payload = [
        'title' => sanitize_text_field($request->get_param('title')),
        'outline' => sanitize_textarea_field($request->get_param('outline')),
        'keywords' => array_map('sanitize_text_field', (array) $request->get_param('keywords')),
        'language' => sanitize_text_field($request->get_param('language')),
    ];

    $response = wp_remote_post(rtrim($bridge_url, '/') . '/generate', [
        'headers' => ['Content-Type' => 'application/json'],
        'body' => wp_json_encode($payload),
        'timeout' => 15,
    ]);

    if (is_wp_error($response)) {
        return new WP_REST_Response(['error' => $response->get_error_message()], 502);
    }

    $status = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    return new WP_REST_Response($body, $status ?: 200);
}
