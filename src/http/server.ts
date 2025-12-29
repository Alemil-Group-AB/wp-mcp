import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { z } from "zod";

import type { AIProvider } from "../ai/provider.js";

const generatePostSchema = z.object({
  title: z.string().min(1),
  outline: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  language: z.string().optional(),
});

export type HttpServerOptions = {
  port: number;
  aiProvider: AIProvider;
};

const readJsonBody = async (req: IncomingMessage): Promise<unknown> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) {
    return {};
  }
  const raw = Buffer.concat(chunks).toString("utf-8");
  return JSON.parse(raw);
};

const sendJson = (res: ServerResponse, status: number, body: unknown): void => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body, null, 2));
};

export const startHttpServer = ({ port, aiProvider }: HttpServerOptions): void => {
  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === "GET" && req.url === "/health") {
        sendJson(res, 200, { status: "ok" });
        return;
      }

      if (req.method === "POST" && req.url === "/generate") {
        const payload = await readJsonBody(req);
        const input = generatePostSchema.parse(payload);
        const generated = await aiProvider.generatePost(input);
        sendJson(res, 200, generated);
        return;
      }

      sendJson(res, 404, { error: "Not found" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        sendJson(res, 400, { error: "Invalid request", details: error.errors });
        return;
      }
      sendJson(res, 500, { error: "Server error" });
    }
  });

  server.listen(port, () => {
    console.log(`HTTP bridge listening on :${port}`);
  });
};
