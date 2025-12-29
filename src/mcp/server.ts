import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import type { AIProvider } from "../ai/provider.js";
import { NullAIProvider } from "../ai/null-provider.js";
import type { AppConfig } from "../config.js";
import { WordPressClient } from "../wordpress/client.js";

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  status: z.enum(["draft", "publish", "private", "future"]).optional(),
});

const updatePostSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.enum(["draft", "publish", "private", "future"]).optional(),
});

const deletePostSchema = z.object({
  id: z.number().int().positive(),
  force: z.boolean().optional(),
});

const generatePostSchema = z.object({
  title: z.string().min(1),
  outline: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  language: z.string().optional(),
});

export type MCPServerOptions = {
  config: AppConfig;
  aiProvider?: AIProvider;
};

export const startServer = async ({ config, aiProvider }: MCPServerOptions): Promise<void> => {
  const client = new WordPressClient(
    config.wordpressUrl,
    config.wordpressUser,
    config.wordpressAppPassword,
  );
  const provider = aiProvider ?? new NullAIProvider();

  const server = new Server(
    { name: "wp-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler("tools/list", async () => ({
    tools: [
      {
        name: "create_post",
        description: "Create a WordPress post.",
        inputSchema: createPostSchema,
      },
      {
        name: "update_post",
        description: "Update a WordPress post.",
        inputSchema: updatePostSchema,
      },
      {
        name: "delete_post",
        description: "Delete a WordPress post.",
        inputSchema: deletePostSchema,
      },
      {
        name: "generate_post",
        description: "Generate a post draft using the configured AI provider.",
        inputSchema: generatePostSchema,
      },
    ],
  }));

  server.setRequestHandler("tools/call", async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "create_post": {
        const input = createPostSchema.parse(args ?? {});
        const result = await client.createPost(input);
        return {
          content: [{
            type: "text",
            text: `Post created: ${result.id} (${result.title.rendered})`,
          }],
        };
      }
      case "update_post": {
        const input = updatePostSchema.parse(args ?? {});
        const result = await client.updatePost(input);
        return {
          content: [{
            type: "text",
            text: `Post updated: ${result.id} (${result.title.rendered})`,
          }],
        };
      }
      case "delete_post": {
        const input = deletePostSchema.parse(args ?? {});
        const result = await client.deletePost(input.id, input.force ?? false);
        return {
          content: [{
            type: "text",
            text: `Post deleted: ${result.previous.id} (${result.previous.title.rendered})`,
          }],
        };
      }
      case "generate_post": {
        const input = generatePostSchema.parse(args ?? {});
        const generated = await provider.generatePost(input);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(generated, null, 2),
          }],
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
};
