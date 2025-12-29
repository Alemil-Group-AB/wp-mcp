import type { AIProvider, GeneratePostInput, GeneratedPost } from "./provider.js";

export class NullAIProvider implements AIProvider {
  async generatePost(input: GeneratePostInput): Promise<GeneratedPost> {
    return {
      title: input.title,
      content: input.outline ?? "",
      excerpt: input.keywords?.join(", "),
    };
  }
}
