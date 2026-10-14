import https from "https";
import type { Channel3SearchRequest, Channel3SearchResponse } from "./types";

interface Channel3ClientConfig {
  apiUrl: string;
  apiKey: string;
  country?: string;
  currency?: string;
  language?: string;
}

export class Channel3Client {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly country?: string;
  private readonly currency?: string;
  private readonly language?: string;

  constructor(config: Channel3ClientConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, "");
    this.apiKey = config.apiKey;
    this.country = config.country;
    this.currency = config.currency;
    this.language = config.language;
  }

  async searchProducts(query: string, limit: number): Promise<Channel3SearchResponse> {
    const requestBody: Channel3SearchRequest = {
      query,
      limit,
      filters: {
        conditions: ["new"]
      },
      config: {
        country: this.country,
        currency: this.currency,
        language: this.language,
        mode: "default"
      }
    };

    return postJson<Channel3SearchRequest, Channel3SearchResponse>(
      `${this.apiUrl}/v1/search`,
      requestBody,
      {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey
      }
    );
  }
}

export function createChannel3ClientFromEnv(): Channel3Client {
  const apiKey = process.env.CHANNEL3_API_KEY;

  if (!apiKey) {
    throw new Error("CHANNEL3_API_KEY is required to import products from Channel3.");
  }

  return new Channel3Client({
    apiUrl: process.env.CHANNEL3_API_URL ?? "https://api.trychannel3.com",
    apiKey,
    country: process.env.CHANNEL3_COUNTRY,
    currency: process.env.CHANNEL3_CURRENCY,
    language: process.env.CHANNEL3_LANGUAGE
  });
}

function postJson<TBody, TResponse>(
  url: string,
  body: TBody,
  headers: Record<string, string>
): Promise<TResponse> {
  const payload = JSON.stringify(body);
  const parsedUrl = new URL(url);

  return new Promise<TResponse>((resolve, reject) => {
    const request = https.request(
      {
        hostname: parsedUrl.hostname,
        path: `${parsedUrl.pathname}${parsedUrl.search}`,
        method: "POST",
        headers: {
          ...headers,
          "Content-Length": Buffer.byteLength(payload).toString()
        }
      },
      (response) => {
        let raw = "";

        response.setEncoding("utf8");
        response.on("data", (chunk: string) => {
          raw += chunk;
        });
        response.on("end", () => {
          const statusCode = response.statusCode ?? 500;

          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`Channel3 request failed with status ${statusCode}: ${raw}`));
            return;
          }

          try {
            resolve(JSON.parse(raw) as TResponse);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.on("error", reject);
    request.write(payload);
    request.end();
  });
}
