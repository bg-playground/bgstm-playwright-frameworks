// Apache-2.0
// Mirrors `backend/app/schemas/external_results.py` in bg-playground/BGSTM. Keep in sync.

export type RunStatus = 'queued' | 'in_progress' | 'passed' | 'failed' | 'aborted';

export interface SessionCreate {
  project_id: string;
  git_sha?: string;
  git_branch?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface SessionResponse {
  session_id: string;
  status: RunStatus;
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
