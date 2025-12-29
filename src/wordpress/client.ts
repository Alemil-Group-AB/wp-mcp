export type PostInput = {
  title: string;
  content: string;
  excerpt?: string;
  status?: "draft" | "publish" | "private" | "future";
};

export type PostUpdate = Partial<PostInput> & { id: number };

export type PostResponse = {
  id: number;
  link: string;
  status: string;
  title: { rendered: string };
};

export class WordPressClient {
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(baseUrl: string, username: string, appPassword: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    const token = Buffer.from(`${username}:${appPassword}`).toString("base64");
    this.authHeader = `Basic ${token}`;
  }

  async createPost(input: PostInput): Promise<PostResponse> {
    return this.request<PostResponse>("/wp-json/wp/v2/posts", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updatePost(input: PostUpdate): Promise<PostResponse> {
    const { id, ...rest } = input;
    return this.request<PostResponse>(`/wp-json/wp/v2/posts/${id}`, {
      method: "POST",
      body: JSON.stringify(rest),
    });
  }

  async deletePost(id: number, force = false): Promise<{ deleted: boolean; previous: PostResponse }> {
    const query = new URLSearchParams({ force: String(force) }).toString();
    return this.request<{ deleted: boolean; previous: PostResponse }>(
      `/wp-json/wp/v2/posts/${id}?${query}`,
      { method: "DELETE" },
    );
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: this.authHeader,
        ...(init.headers ?? {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WordPress API error (${response.status}): ${errorText}`);
    }

    return (await response.json()) as T;
  }
}
