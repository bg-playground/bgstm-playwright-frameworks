// Apache-2.0

import type { FullConfig, FullResult, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { readFile } from 'node:fs/promises';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import BGSTMReporter from '../bgstm-reporter.js';
import type { SessionResponse } from '../../types/external-results.js';

vi.mock('node:fs/promises');

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

const createTestCase = (
  titlePath: string[],
  annotations: Array<{ type: string; description?: string }> = [],
): TestCase => {
  return {
    title: titlePath[titlePath.length - 1] ?? '',
    titlePath: () => titlePath,
    annotations,
  } as unknown as TestCase;
};

const createTestResult = (
  overrides: Partial<TestResult> = {},
): TestResult => {
  return {
    status: 'passed',
    retry: 0,
    duration: 123,
    attachments: [],
    error: undefined,
    ...overrides,
  } as unknown as TestResult;
};

const createSessionResponse = (overrides: Partial<SessionResponse> = {}): SessionResponse => ({
  id: 'sess-1',
  status: 'started',
  started_at: '2024-01-01T00:00:00Z',
  finished_at: null,
  runner: '@bgstm/playwright-core@0.1.0',
  project_id: 'proj-1',
  git_sha: null,
  git_branch: null,
  ci_url: null,
  metadata: {},
  ...overrides,
});

const SESSION_RESPONSE = createSessionResponse();
const CASE_RESPONSE = {
  id: 'case-result-1',
  session_id: 'sess-1',
  external_id: 'Suite > test',
  title: 'test',
  outcome: 'passed',
  duration_ms: 123,
  requirement_ids: [],
  created_at: '2024-01-01T00:00:00Z',
  auto_registered: false,
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
    fetchMock.mockResolvedValueOnce(createJsonResponse(SESSION_RESPONSE));

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
      .mockResolvedValueOnce(createJsonResponse(SESSION_RESPONSE))
      .mockResolvedValueOnce(createJsonResponse(SESSION_RESPONSE));

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
      .mockResolvedValueOnce(createJsonResponse(SESSION_RESPONSE))
      .mockResolvedValueOnce(createJsonResponse(createSessionResponse({ status: 'failed' })));

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
    fetchMock.mockResolvedValue(createJsonResponse(SESSION_RESPONSE));

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

  // ---------------------------------------------------------------------------
  // onTestEnd tests
  // ---------------------------------------------------------------------------

  describe('onTestEnd', () => {
    const makeReporter = async () => {
      fetchMock.mockResolvedValueOnce(createJsonResponse(SESSION_RESPONSE));
      const reporter = new BGSTMReporter({
        apiUrl: 'https://bgstm.example.com',
        apiToken: 'bgstm_runner_abc123',
        projectId: 'proj-1',
      });
      await reporter.onBegin({} as FullConfig, createSuite());
      fetchMock.mockReset();
      return reporter;
    };

    it('POSTs correct case-result payload for a passing test', async () => {
      const reporter = await makeReporter();
      fetchMock.mockResolvedValueOnce(createJsonResponse(CASE_RESPONSE));

      const test = createTestCase(['Suite', 'test']);
      const result = createTestResult({ status: 'passed', retry: 0, duration: 500 });

      await reporter.onTestEnd(test, result);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, req] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('https://bgstm.example.com/api/v1/external-results/case');
      expect(req.method).toBe('POST');
      expect(JSON.parse(req.body as string)).toMatchObject({
        session_id: 'sess-1',
        external_id: 'Suite > test',
        title: 'test',
        outcome: 'passed',
        duration_ms: 500,
      });
    });

    it('reads sessionId from response.id (regression: was response.session_id)', async () => {
      fetchMock
        .mockResolvedValueOnce(createJsonResponse(createSessionResponse({ id: 'sess-from-id' })))
        .mockResolvedValueOnce(createJsonResponse(CASE_RESPONSE));

      const reporter = new BGSTMReporter({
        apiUrl: 'https://bgstm.example.com',
        apiToken: 'bgstm_runner_abc123',
        projectId: 'proj-1',
      });
      await reporter.onBegin({} as FullConfig, createSuite());

      const test = createTestCase(['Suite', 'id regression']);
      const result = createTestResult({ status: 'passed', retry: 0, duration: 42 });
      await reporter.onTestEnd(test, result);

      const [, req] = fetchMock.mock.calls[1] as [string, RequestInit];
      expect(JSON.parse(req.body as string)).toMatchObject({ session_id: 'sess-from-id' });
    });

    it('maps outcome: passed after retry → flaky', async () => {
      const reporter = await makeReporter();
      fetchMock.mockResolvedValueOnce(createJsonResponse({ ...CASE_RESPONSE, outcome: 'flaky' }));

      const test = createTestCase(['Suite', 'flaky test']);
      const result = createTestResult({ status: 'passed', retry: 1, duration: 200 });

      await reporter.onTestEnd(test, result);

      const [, req] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(req.body as string)).toMatchObject({ outcome: 'flaky' });
    });

    it('maps outcome: failed → failed, includes error_message', async () => {
      const reporter = await makeReporter();
      fetchMock.mockResolvedValueOnce(createJsonResponse({ ...CASE_RESPONSE, outcome: 'failed' }));

      const test = createTestCase(['Suite', 'failing test']);
      const result = createTestResult({
        status: 'failed',
        retry: 0,
        duration: 300,
        error: { message: 'Expected foo but got bar' },
      });

      await reporter.onTestEnd(test, result);

      const [, req] = fetchMock.mock.calls[0] as [string, RequestInit];
      const body = JSON.parse(req.body as string);
      expect(body.outcome).toBe('failed');
      expect(body.error_message).toBe('Expected foo but got bar');
    });

    it('maps outcome: timedOut → failed', async () => {
      const reporter = await makeReporter();
      fetchMock.mockResolvedValueOnce(createJsonResponse({ ...CASE_RESPONSE, outcome: 'failed' }));

      const test = createTestCase(['Suite', 'timed out test']);
      const result = createTestResult({ status: 'timedOut', retry: 0, duration: 30000 });

      await reporter.onTestEnd(test, result);

      const [, req] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(req.body as string).outcome).toBe('failed');
    });

    it('maps outcome: skipped → skipped', async () => {
      const reporter = await makeReporter();
      fetchMock.mockResolvedValueOnce(createJsonResponse({ ...CASE_RESPONSE, outcome: 'skipped' }));

      const test = createTestCase(['Suite', 'skipped test']);
      const result = createTestResult({ status: 'skipped', retry: 0, duration: 0 });

      await reporter.onTestEnd(test, result);

      const [, req] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(req.body as string).outcome).toBe('skipped');
    });

    it('maps outcome: interrupted → skipped', async () => {
      const reporter = await makeReporter();
      fetchMock.mockResolvedValueOnce(createJsonResponse({ ...CASE_RESPONSE, outcome: 'skipped' }));

      const test = createTestCase(['Suite', 'interrupted test']);
      const result = createTestResult({ status: 'interrupted', retry: 0, duration: 0 });

      await reporter.onTestEnd(test, result);

      const [, req] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(req.body as string).outcome).toBe('skipped');
    });

    it('does not upload artifacts for passing tests', async () => {
      const reporter = await makeReporter();
      fetchMock.mockResolvedValueOnce(createJsonResponse(CASE_RESPONSE));

      const test = createTestCase(['Suite', 'passing test']);
      const result = createTestResult({
        status: 'passed',
        attachments: [{ name: 'screenshot', contentType: 'image/png', body: Buffer.from('img') }],
      });

      await reporter.onTestEnd(test, result);

      // Only the case-result POST — no artifact upload
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('uploads in-memory attachments for failed tests', async () => {
      const reporter = await makeReporter();
      fetchMock
        .mockResolvedValueOnce(createJsonResponse({ ...CASE_RESPONSE, outcome: 'failed' }))
        .mockResolvedValueOnce(createJsonResponse({ id: 'art-1', url: 'https://example.com/art-1' }));

      const test = createTestCase(['Suite', 'failed test']);
      const result = createTestResult({
        status: 'failed',
        retry: 0,
        duration: 100,
        attachments: [
          {
            name: 'screenshot',
            contentType: 'image/png',
            body: Buffer.from('png-data'),
          },
        ],
      });

      await reporter.onTestEnd(test, result);

      // One case-result POST + one artifact POST
      expect(fetchMock).toHaveBeenCalledTimes(2);
      const [artifactUrl, artifactReq] = fetchMock.mock.calls[1] as [string, RequestInit];
      expect(artifactUrl).toBe('https://bgstm.example.com/api/v1/external-results/artifact');
      expect(artifactReq.method).toBe('POST');
      expect(artifactReq.body).toBeInstanceOf(FormData);
    });

    it('uploads path-based attachments for failed tests', async () => {
      vi.mocked(readFile).mockResolvedValueOnce(Buffer.from('file-data') as unknown as string);

      const reporter = await makeReporter();
      fetchMock
        .mockResolvedValueOnce(createJsonResponse({ ...CASE_RESPONSE, outcome: 'failed' }))
        .mockResolvedValueOnce(createJsonResponse({ id: 'art-2', url: 'https://example.com/art-2' }));

      const test = createTestCase(['Suite', 'failed with path attachment']);
      const result = createTestResult({
        status: 'failed',
        retry: 0,
        duration: 100,
        attachments: [
          {
            name: 'screenshot.png',
            contentType: 'image/png',
            path: '/tmp/screenshots/screenshot.png',
          },
        ],
      });

      await reporter.onTestEnd(test, result);

      expect(vi.mocked(readFile)).toHaveBeenCalledWith('/tmp/screenshots/screenshot.png');
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('skips attachments with disallowed content-types', async () => {
      const reporter = await makeReporter();
      fetchMock.mockResolvedValueOnce(createJsonResponse({ ...CASE_RESPONSE, outcome: 'failed' }));

      const test = createTestCase(['Suite', 'failed test']);
      const result = createTestResult({
        status: 'failed',
        retry: 0,
        duration: 100,
        attachments: [
          {
            name: 'data.bin',
            contentType: 'application/octet-stream',
            body: Buffer.from('binary-data'),
          },
        ],
      });

      await reporter.onTestEnd(test, result);

      // Only the case-result POST — disallowed content-type skipped
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('is a no-op when BGSTM_API_URL is unset', async () => {
      const warn = vi.fn();
      const reporter = new BGSTMReporter({}, { warn });

      const test = createTestCase(['Suite', 'test']);
      const result = createTestResult();

      await expect(reporter.onTestEnd(test, result)).resolves.toBeUndefined();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('tolerateOffline=true swallows onTestEnd errors', async () => {
      const warn = vi.fn();
      fetchMock
        .mockResolvedValueOnce(createJsonResponse(SESSION_RESPONSE))
        .mockRejectedValue(new Error('case result failed'));

      const reporter = new BGSTMReporter(
        {
          apiUrl: 'https://bgstm.example.com',
          apiToken: 'bgstm_runner_abc123',
          projectId: 'proj-1',
          tolerateOffline: true,
        },
        { warn },
      );
      await reporter.onBegin({} as FullConfig, createSuite());

      const test = createTestCase(['Suite', 'test']);
      const result = createTestResult();

      await expect(reporter.onTestEnd(test, result)).resolves.toBeUndefined();
      expect(warn).toHaveBeenCalledWith('[BGSTMReporter] case result failed');
    });

    it('tolerateOffline=false propagates onTestEnd errors', async () => {
      fetchMock
        .mockResolvedValueOnce(createJsonResponse(SESSION_RESPONSE))
        .mockRejectedValue(new Error('case result failed'));

      const reporter = new BGSTMReporter({
        apiUrl: 'https://bgstm.example.com',
        apiToken: 'bgstm_runner_abc123',
        projectId: 'proj-1',
        tolerateOffline: false,
      });
      await reporter.onBegin({} as FullConfig, createSuite());

      const test = createTestCase(['Suite', 'test']);
      const result = createTestResult();

      await expect(reporter.onTestEnd(test, result)).rejects.toThrow('case result failed');
    });
  });
});
