// Apache-2.0

import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

import { BGSTMClient } from './client.js';
import type { RunStatus, SessionCreate, SessionFinish } from '../types/external-results.js';

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

  onTestEnd(_test: TestCase, _result: TestResult): void {
    // TODO(bg-playground/bgstm-playwright-frameworks#3, BGSTM#303): implement per-case reporting.
    // TODO(bg-playground/bgstm-playwright-frameworks#3, BGSTM#298): implement artifact upload reporting.
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
