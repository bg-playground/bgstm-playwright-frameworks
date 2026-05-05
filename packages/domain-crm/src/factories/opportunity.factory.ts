export interface OpportunityData {
  name: string;
  value?: number;
  stage?: string;
}

export class OpportunityFactory {
  static build(overrides: Partial<OpportunityData> = {}): OpportunityData {
    return {
      name: 'Test Opportunity',
      value: 50000,
      stage: 'Prospecting',
      ...overrides,
    };
  }
}
