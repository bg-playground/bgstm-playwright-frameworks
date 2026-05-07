// Apache-2.0

import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

import { BGSTMClient } from './client.js';
import type {
  ArtifactKind,
  CaseOutcome,
  CaseResultCreate,
  RunStatus,
  SessionCreate,
  SessionFinish,
} from '../types/external-results.js';

export interface BGSTMReporterOptions {
  apiUrl?: string;
  apiToken?: string;
  projectId?: string;
  /** Falls back to GITHUB_SHA when omitted. */
  gitSha?: string;
  /** Falls back to GITHUB_REF_NAME when omitted. */
  gitBranch?: string;
  tolerateOffline?: boolean;
}

const RUNNER_TOKEN_PREFIX = 'bgstm_runner_';

/** Maximum artifact size accepted by BGSTM storage (50 MB). */
const MAX_ARTIFACT_BYTES = 50 * 1024 * 1024;

/**
 * Content-types accepted by BGSTM's artifact storage.
 * Matches the server-side allowlist — the server is authoritative; this is a courtesy filter.
 */
const ALLOWED_CONTENT_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'video/mp4',
  'video/webm',
  'application/zip',
  'text/plain',
  'application/json',
]);

type Logger = Pick<Console, 'warn'>;

export default class BGSTMReporter implements Reporter {
  private readonly apiUrl?: string;
  private readonly apiToken?: string;
  private readonly projectId?: string;
  private readonly gitSha?: string;
  private readonly gitBranch?: string;
  private readonly tolerateOffline: boolean;
  private readonly logger: Logger;

  private client?: BGSTMClient;
  private sessionId?: string;
  private rootSuite?: Suite;

  constructor(options: BGSTMReporterOptions = {}, logger: Logger = console) {
    this.apiUrl = options.apiUrl ?? process.env.BGSTM_API_URL;
    this.apiToken = options.apiToken ?? process.env.BGSTM_API_TOKEN;
    this.projectId = options.projectId ?? process.env.BGSTM_PROJECT_ID;
    this.gitSha = options.gitSha ?? process.env.GITHUB_SHA;
    this.gitBranch = options.gitBranch ?? process.env.GITHUB_REF_NAME;
    this.tolerateOffline = options.tolerateOffline ?? true;
    this.logger = logger;

    if (!this.apiUrl) {
      this.logger.warn('[BGSTMReporter] BGSTM_API_URL is not set. Reporter is disabled.');
      return;
    }

    if (this.apiToken && !this.apiToken.startsWith(RUNNER_TOKEN_PREFIX)) {
      this.logger.warn('[BGSTMReporter] API token format appears invalid. Continuing anyway.');
    }

    this.client = new BGSTMClient({
      apiUrl: this.apiUrl,
      apiToken: this.apiToken,
    });
  }

  async onBegin(_config: FullConfig, suite: Suite): Promise<void> {
    this.rootSuite = suite;

    if (!this.client) {
      return;
    }

    if (!this.projectId) {
      this.logger.warn('[BGSTMReporter] BGSTM_PROJECT_ID is not set. Reporter is disabled.');
      return;
    }

    const payload: SessionCreate = {
      project_id: this.projectId,
      git_sha: this.gitSha,
      git_branch: this.gitBranch,
    };

    await this.runSafely(async () => {
      const response = await this.client!.createSession(payload);
      this.sessionId = response.session_id;
    });
  }

  async onTestEnd(test: TestCase, result: TestResult): Promise<void> {
    if (!this.client || !this.sessionId) {
      return;
    }

    await this.runSafely(async () => {
      const outcome = this.mapCaseOutcome(result);

      const payload: CaseResultCreate = {
        session_id: this.sessionId!,
        external_id: test.titlePath().join(' > '),
        title: test.title,
        outcome,
        duration_ms: result.duration,
      };

      if (outcome === 'failed') {
        payload.error_message = result.error?.message?.slice(0, 2048);
      }

      const caseResult = await this.client!.createCaseResult(payload);

      if (outcome === 'failed') {
        for (const attachment of result.attachments) {
          await this.uploadAttachment(caseResult.id, attachment);
        }
      }
    });
  }

  async onEnd(result: FullResult): Promise<void> {
    if (!this.client || !this.sessionId) {
      return;
    }

    const payload: SessionFinish = {
      status: this.mapRunStatus(result.status),
      summary: this.buildSummary(),
    };

    await this.runSafely(async () => {
      await this.client!.finishSession(this.sessionId!, payload);
    });
  }

  private mapCaseOutcome(result: TestResult): CaseOutcome {
    switch (result.status) {
      case 'passed':
        return result.retry > 0 ? 'flaky' : 'passed';
      case 'failed':
      case 'timedOut':
        return 'failed';
      default:
        return 'skipped';
    }
  }

  private async uploadAttachment(
    caseResultId: string,
    attachment: TestResult['attachments'][number],
  ): Promise<void> {
    if (!ALLOWED_CONTENT_TYPES.has(attachment.contentType)) {
      return;
    }

    let body: Buffer;

    if (attachment.body) {
      body = attachment.body;
    } else if (attachment.path) {
      body = await readFile(attachment.path);
    } else {
      return;
    }

    if (body.byteLength > MAX_ARTIFACT_BYTES) {
      this.logger.warn(
        `[BGSTMReporter] Skipping artifact "${attachment.name}" (${body.byteLength} bytes > ${MAX_ARTIFACT_BYTES} byte limit).`,
      );
      return;
    }

    const kind = this.inferArtifactKind(attachment.name, attachment.contentType);
    const filename = attachment.path ? basename(attachment.path) : attachment.name;

    await this.client!.uploadArtifact({
      caseResultId,
      kind,
      filename,
      contentType: attachment.contentType,
      body,
    });
  }

  private inferArtifactKind(name: string, contentType: string): ArtifactKind {
    const lower = name.toLowerCase();
    if (lower.includes('screenshot')) {
      return 'screenshot';
    }
    if (lower.includes('trace') || contentType === 'application/zip') {
      return 'trace';
    }
    if (contentType.startsWith('video/')) {
      return 'video';
    }
    return 'other';
  }

  private mapRunStatus(status: FullResult['status']): Extract<RunStatus, 'passed' | 'failed' | 'aborted'> {
    if (status === 'passed') {
      return 'passed';
    }

    if (status === 'interrupted') {
      return 'aborted';
    }

    return 'failed';
  }

  private buildSummary(): SessionFinish['summary'] {
    const tests = this.rootSuite?.allTests() ?? [];

    let passed = 0;
    let failed = 0;
    let skipped = 0;

    for (const test of tests) {
      const outcome = test.outcome();

      if (outcome === 'expected' || outcome === 'flaky') {
        passed += 1;
        continue;
      }

      if (outcome === 'unexpected') {
        failed += 1;
        continue;
      }

      skipped += 1;
    }

    return {
      total: tests.length,
      passed,
      failed,
      skipped,
    };
  }

  private async runSafely(callback: () => Promise<void>): Promise<void> {
    try {
      await callback();
    } catch (error) {
      if (this.tolerateOffline) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.warn(`[BGSTMReporter] ${message}`);
        return;
      }

      throw error;
    }
  }
}
