export type GeneratePostInput = {
  title: string;
  outline?: string;
  keywords?: string[];
  language?: string;
};

export type GeneratedPost = {
  title: string;
  content: string;
  excerpt?: string;
};

export interface AIProvider {
  generatePost(input: GeneratePostInput): Promise<GeneratedPost>;
}
