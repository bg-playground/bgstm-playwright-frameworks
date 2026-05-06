// Apache-2.0

import type { SessionCreate, SessionFinish, SessionResponse } from '../types/external-results.js';

export interface BGSTMClientOptions {
  apiUrl: string;
  apiToken?: string;
}

export class BGSTMClient {
  private readonly baseUrl: string;
  private readonly apiToken?: string;

  constructor(options: BGSTMClientOptions) {
    this.baseUrl = options.apiUrl.replace(/\/$/, '');
    this.apiToken = options.apiToken;
  }

  async createSession(payload: SessionCreate): Promise<SessionResponse> {
    return this.request<SessionResponse>('/api/v1/external-results/session', {
      method: 'POST',
      body: payload,
    });
  }

  async finishSession(sessionId: string, payload: SessionFinish): Promise<SessionResponse> {
    return this.request<SessionResponse>(`/api/v1/external-results/session/${sessionId}`, {
      method: 'PATCH',
      body: payload,
    });
  }

  private async request<TResponse>(
    path: string,
    options: {
      method: 'POST' | 'PATCH';
      body: SessionCreate | SessionFinish;
    },
  ): Promise<TResponse> {
    const headers: Record<string, string> = {
      'content-type': 'application/json',
    };

    if (this.apiToken) {
      headers.authorization = `Bearer ${this.apiToken}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method,
      headers,
      body: JSON.stringify(options.body),
    });

    if (!response.ok) {
      const responseBody = await response.text();
      throw new Error(
        `BGSTM API request failed (${response.status} ${response.statusText}): ${responseBody}`,
      );
    }

    return (await response.json()) as TResponse;
  }
}
