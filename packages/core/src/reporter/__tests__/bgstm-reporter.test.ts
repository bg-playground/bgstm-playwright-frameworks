// Apache-2.0

import type { FullConfig, FullResult, Suite } from '@playwright/test/reporter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import BGSTMReporter from '../bgstm-reporter.js';

const createSuite = (outcomes: Array<'expected' | 'flaky' | 'unexpected' | 'skipped'> = []): Suite => {
  return {
    allTests: () => outcomes.map((outcome) => ({ outcome: () => outcome })),
  } as unknown as Suite;
};

const createJsonResponse = <T>(payload: T): Response => {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

describe('BGSTMReporter', () => {
  const originalEnv = process.env;
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    process.env = { ...originalEnv };
    delete process.env.BGSTM_API_URL;
    delete process.env.BGSTM_API_TOKEN;
    delete process.env.BGSTM_PROJECT_ID;
    delete process.env.GITHUB_SHA;
    delete process.env.GITHUB_REF_NAME;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  it('onBegin POSTs to /external-results/session with correct body shape', async () => {
    fetchMock.mockResolvedValueOnce(createJsonResponse({ session_id: 'sess-1', status: 'in_progress' }));

    const reporter = new BGSTMReporter({
      apiUrl: 'https://bgstm.example.com',
      apiToken: 'bgstm_runner_abc123',
      projectId: 'proj-1',
      gitSha: 'abc',
      gitBranch: 'feature/test',
    });

    await reporter.onBegin({} as FullConfig, createSuite());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://bgstm.example.com/api/v1/external-results/session',
      expect.objectContaining({
        method: 'POST',
      }),
    );

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(request.body).toBe(
      JSON.stringify({
        project_id: 'proj-1',
        git_sha: 'abc',
        git_branch: 'feature/test',
      }),
    );
  });

  it('uses Authorization header token from options or environment', async () => {
    fetchMock
      .mockResolvedValueOnce(createJsonResponse({ session_id: 'sess-1', status: 'in_progress' }))
      .mockResolvedValueOnce(createJsonResponse({ session_id: 'sess-1', status: 'in_progress' }));

    process.env.BGSTM_API_TOKEN = 'bgstm_runner_from_env';

    const envReporter = new BGSTMReporter({
      apiUrl: 'https://bgstm.example.com',
      projectId: 'proj-1',
    });
    await envReporter.onBegin({} as FullConfig, createSuite());

    const firstCall = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(firstCall[1].headers).toMatchObject({
      authorization: 'Bearer bgstm_runner_from_env',
    });

    const optionReporter = new BGSTMReporter({
      apiUrl: 'https://bgstm.example.com',
      apiToken: 'bgstm_runner_from_option',
      projectId: 'proj-1',
    });
    await optionReporter.onBegin({} as FullConfig, createSuite());

    const secondCall = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(secondCall[1].headers).toMatchObject({
      authorization: 'Bearer bgstm_runner_from_option',
    });
  });

  it('onEnd PATCHes session with aggregate status', async () => {
    fetchMock
      .mockResolvedValueOnce(createJsonResponse({ session_id: 'sess-1', status: 'in_progress' }))
      .mockResolvedValueOnce(createJsonResponse({ session_id: 'sess-1', status: 'failed' }));

    const reporter = new BGSTMReporter({
      apiUrl: 'https://bgstm.example.com',
      apiToken: 'bgstm_runner_abc123',
      projectId: 'proj-1',
    });

    await reporter.onBegin({} as FullConfig, createSuite(['unexpected', 'expected', 'skipped']));
    await reporter.onEnd({ status: 'failed' } as FullResult);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [url, request] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(url).toBe('https://bgstm.example.com/api/v1/external-results/session/sess-1');
    expect(request.method).toBe('PATCH');
    expect(request.body).toBe(
      JSON.stringify({
        status: 'failed',
        summary: {
          total: 3,
          passed: 1,
          failed: 1,
          skipped: 1,
        },
      }),
    );
  });

  it('tolerateOffline=true swallows network errors and logs warning', async () => {
    const warn = vi.fn();
    fetchMock.mockRejectedValue(new Error('network down'));

    const reporter = new BGSTMReporter(
      {
        apiUrl: 'https://bgstm.example.com',
        apiToken: 'bgstm_runner_abc123',
        projectId: 'proj-1',
        tolerateOffline: true,
      },
      { warn },
    );

    await expect(reporter.onBegin({} as FullConfig, createSuite())).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith('[BGSTMReporter] network down');
  });

  it('tolerateOffline=false rethrows network errors', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));

    const reporter = new BGSTMReporter({
      apiUrl: 'https://bgstm.example.com',
      apiToken: 'bgstm_runner_abc123',
      projectId: 'proj-1',
      tolerateOffline: false,
    });

    await expect(reporter.onBegin({} as FullConfig, createSuite())).rejects.toThrow('network down');
  });

  it('no-ops gracefully when BGSTM_API_URL is unset', async () => {
    const warn = vi.fn();

    const reporter = new BGSTMReporter({}, { warn });

    await expect(reporter.onBegin({} as FullConfig, createSuite())).resolves.toBeUndefined();
    await expect(reporter.onEnd({ status: 'passed' } as FullResult)).resolves.toBeUndefined();

    expect(warn).toHaveBeenCalledWith('[BGSTMReporter] BGSTM_API_URL is not set. Reporter is disabled.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uses GITHUB_SHA and GITHUB_REF_NAME when git values are not provided', async () => {
    fetchMock.mockResolvedValue(createJsonResponse({ session_id: 'sess-1', status: 'in_progress' }));

    process.env.BGSTM_API_URL = 'https://bgstm.example.com';
    process.env.BGSTM_API_TOKEN = 'bgstm_runner_from_env';
    process.env.BGSTM_PROJECT_ID = 'proj-1';
    process.env.GITHUB_SHA = 'sha-from-env';
    process.env.GITHUB_REF_NAME = 'branch-from-env';

    const reporter = new BGSTMReporter();
    await reporter.onBegin({} as FullConfig, createSuite());

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(request.body).toBe(
      JSON.stringify({
        project_id: 'proj-1',
        git_sha: 'sha-from-env',
        git_branch: 'branch-from-env',
      }),
    );
  });
});
