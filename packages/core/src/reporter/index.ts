import type { Reporter, FullConfig, Suite, TestCase, TestResult } from '@playwright/test/reporter';

export interface BgstmReporterOptions {
  /** Base URL of the BGSTM instance */
  baseUrl: string;
  /** BGSTM API token */
  token: string;
  /** Optional run identifier */
  runId?: string;
}

/**
 * BGSTM Reporter — implements the BGSTM Reporter API contract.
 * @see https://github.com/bg-playground/BGSTM/issues/291
 */
export function bgstmReporter(options: BgstmReporterOptions): [string, BgstmReporterOptions] {
  return ['@bgstm/playwright-core/reporter', options];
}

class BgstmReporter implements Reporter {
  private options: BgstmReporterOptions;

  constructor(options: BgstmReporterOptions) {
    this.options = options;
  }

  onBegin(_config: FullConfig, _suite: Suite): void {
    // TODO: POST /api/runs to BGSTM to create a new test run
  }

  onTestEnd(_test: TestCase, _result: TestResult): void {
    // TODO: POST /api/runs/:runId/results to BGSTM
  }

  async onEnd(): Promise<void> {
    // TODO: PATCH /api/runs/:runId to mark run complete
  }
}

export default BgstmReporter;
