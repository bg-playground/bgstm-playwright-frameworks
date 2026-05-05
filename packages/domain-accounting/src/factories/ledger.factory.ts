export interface LedgerData {
  name: string;
  currency?: string;
}

export class LedgerFactory {
  static build(overrides: Partial<LedgerData> = {}): LedgerData {
    return {
      name: 'Test Ledger',
      currency: 'USD',
      ...overrides,
    };
  }
}
