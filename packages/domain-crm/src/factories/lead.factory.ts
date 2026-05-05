export interface LeadData {
  name: string;
  value?: number;
  status?: 'new' | 'contacted' | 'qualified' | 'lost';
}

export class LeadFactory {
  static build(overrides: Partial<LeadData> = {}): LeadData {
    return {
      name: 'Test Lead',
      value: 10000,
      status: 'new',
      ...overrides,
    };
  }
}
