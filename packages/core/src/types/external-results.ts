// Apache-2.0
// Mirrors `backend/app/schemas/external_results.py` in bg-playground/BGSTM. Keep in sync.

export type RunStatus = 'started' | 'passed' | 'failed' | 'skipped' | 'aborted';

export interface SessionCreate {
  project_id: string;
  git_sha?: string;
  git_branch?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface SessionResponse {
  id: string;
  status: RunStatus;
  started_at: string;
  finished_at: string | null;
  runner: string;
  project_id: string;
  git_sha: string | null;
  git_branch: string | null;
  ci_url: string | null;
  metadata: Record<string, unknown>;
}

export interface SessionFinish {
  status: Extract<RunStatus, 'passed' | 'failed' | 'aborted'>;
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
}

// ---------------------------------------------------------------------------
// Case result types — mirrors CaseResultCreate / CaseResultResponse
// ---------------------------------------------------------------------------

/** Outcome for an individual test-case result. Mirrors Python CaseOutcome enum. */
export type CaseOutcome = 'passed' | 'failed' | 'skipped' | 'flaky';

export interface CaseResultCreate {
  /** Session this result belongs to. */
  session_id: string;
  /** Runner-assigned identifier (full title path). Duplicate within same session collapses to one row. */
  external_id: string;
  /** Human-readable test title (last segment of titlePath). */
  title: string;
  outcome: CaseOutcome;
  /** Wall-clock duration in milliseconds. */
  duration_ms: number;
  /** First error line or assertion message (trimmed to ~2 KB). */
  error_message?: string;
  /** Reporter-supplied external IDs that BGSTM resolves against requirements.external_id. */
  requirement_external_ids?: string[];
}

export interface CaseResultResponse {
  id: string;
  session_id: string;
  test_case_id?: string;
  external_id?: string;
  title: string;
  outcome: CaseOutcome;
  duration_ms: number;
  error_message?: string;
  requirement_ids: string[];
  created_at: string;
  /** True when BGSTM created a new test-case record from external_id. */
  auto_registered: boolean;
}

// ---------------------------------------------------------------------------
// Artifact types — mirrors ArtifactCreate / ArtifactResponse
// ---------------------------------------------------------------------------

/** Type of binary artifact attached to a case result. Mirrors Python ArtifactKind enum. */
export type ArtifactKind = 'screenshot' | 'trace' | 'video' | 'log' | 'other';

export interface ArtifactResponse {
  id: string;
  case_result_id: string;
  kind: ArtifactKind;
  filename: string;
  content_type: string;
  size_bytes: number;
  url: string;
  created_at: string;
}
