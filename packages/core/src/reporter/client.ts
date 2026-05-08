// Apache-2.0

import type {
  ArtifactKind,
  ArtifactResponse,
  CaseResultCreate,
  CaseResultResponse,
  SessionCreate,
  SessionFinish,
  SessionResponse,
} from '../types/external-results.js';

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
    return this.request('/api/v1/external-results/session', {
      method: 'POST',
      body: payload,
    });
  }

  async finishSession(
    sessionId: string,
    payload: SessionFinish,
  ): Promise<SessionResponse> {
    return this.request(`/api/v1/external-results/session/${sessionId}`, {
      method: 'PATCH',
      body: payload,
    });
  }

  async createCaseResult(payload: CaseResultCreate): Promise<CaseResultResponse> {
    return this.request('/api/v1/external-results/case', {
      method: 'POST',
      body: payload,
    });
  }

  async uploadArtifact(args: {
    caseResultId: string;
    kind: ArtifactKind;
    filename: string;
    contentType: string;
    body: Buffer;
  }): Promise<ArtifactResponse> {
    const formData = new FormData();
    formData.set('case_result_id', args.caseResultId);
    formData.set('kind', args.kind);
    formData.set('filename', args.filename);
    formData.set('content_type', args.contentType);
    formData.set('size_bytes', String(args.body.byteLength));
    formData.set('file', new Blob([args.body], { type: args.contentType }), args.filename);

    return this.requestMultipart('/api/v1/external-results/artifact', formData);
  }

  private authHeaders(): Record<string, string> {
    if (this.apiToken) {
      return { authorization: `Bearer ${this.apiToken}` };
    }
    return {};
  }

  private async handleResponse<TResponse>(response: Response): Promise<TResponse> {
    if (!response.ok) {
      const responseBody = await response.text();
      throw new Error(
        `BGSTM API request failed (${response.status} ${response.statusText}): ${responseBody}`,
      );
    }

    return (await response.json()) as TResponse;
  }

  private async request<TResponse>(
    path: string,
    options: {
      method: 'POST' | 'PATCH';
      body: unknown;
    },
  ): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method,
      headers: {
        'content-type': 'application/json',
        ...this.authHeaders(),
      },
      body: JSON.stringify(options.body),
    });

    return this.handleResponse<TResponse>(response);
  }

  private async requestMultipart<TResponse>(
    path: string,
    formData: FormData,
  ): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: formData,
    });

    return this.handleResponse<TResponse>(response);
  }
}
