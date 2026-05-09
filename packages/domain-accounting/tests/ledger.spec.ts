// Copyright 2024 bg-playground
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type { Page } from '@playwright/test';
import { describe, expect, it, vi } from 'vitest';

import { LedgerPage } from '../src/pages/ledger.page.js';

const createMockPage = (): Page => {
  return {
    goto: vi.fn().mockResolvedValue(null),
    waitForLoadState: vi.fn().mockResolvedValue(undefined),
  } as unknown as Page;
};

describe('LedgerPage', () => {
  it('is instantiatable and can use the provided page through navigate()', async () => {
    const page = createMockPage();
    const ledgerPage = new LedgerPage(page);

    await ledgerPage.navigate();

    expect(ledgerPage).toBeInstanceOf(LedgerPage);
    expect(vi.mocked(page.goto)).toHaveBeenCalledWith('/ledgers');
  });

  it('navigate() calls goto and waitForLoadState(network idle)', async () => {
    const page = createMockPage();
    const ledgerPage = new LedgerPage(page);

    await ledgerPage.navigate();

    expect(vi.mocked(page.goto)).toHaveBeenCalledWith('/ledgers');
    expect(vi.mocked(page.waitForLoadState)).toHaveBeenCalledWith('networkidle');
  });

  it('filter() currently documents not-yet-implemented behavior', async () => {
    const ledgerPage = new LedgerPage(createMockPage());

    await expect(ledgerPage.filter({ id: 'ledger-1' })).rejects.toThrow('Not yet implemented');
  });

  it('openEntry() is callable and currently not implemented', async () => {
    const ledgerPage = new LedgerPage(createMockPage());

    await expect(ledgerPage.openEntry('ledger-1')).rejects.toThrow('Not yet implemented');
  });

  it('getEntryCount() is callable and currently not implemented', async () => {
    const ledgerPage = new LedgerPage(createMockPage());

    await expect(ledgerPage.getEntryCount()).rejects.toThrow('Not yet implemented');
  });
});
