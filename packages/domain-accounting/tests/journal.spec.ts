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

import { JournalPage } from '../src/pages/journal.page.js';

const createMockPage = (): Page => {
  return {
    goto: vi.fn().mockResolvedValue(null),
    waitForLoadState: vi.fn().mockResolvedValue(undefined),
  } as unknown as Page;
};

describe('JournalPage', () => {
  it('is instantiatable and can use the provided page through navigate()', async () => {
    const page = createMockPage();
    const journalPage = new JournalPage(page);

    await journalPage.navigate();

    expect(journalPage).toBeInstanceOf(JournalPage);
    expect(vi.mocked(page.goto)).toHaveBeenCalledWith('/journals');
  });

  it('navigate() calls goto and waitForLoadState(networkidle)', async () => {
    const page = createMockPage();
    const journalPage = new JournalPage(page);

    await journalPage.navigate();

    expect(vi.mocked(page.goto)).toHaveBeenCalledWith('/journals');
    expect(vi.mocked(page.waitForLoadState)).toHaveBeenCalledWith('networkidle');
  });

  it('create() is callable and currently not implemented', async () => {
    const journalPage = new JournalPage(createMockPage());

    await expect(journalPage.create({ description: 'entry', debit: 100, credit: 100 })).rejects.toThrow(
      'Not yet implemented',
    );
  });

  it('edit() and post() are callable and currently not implemented', async () => {
    const journalPage = new JournalPage(createMockPage());

    await expect(journalPage.edit('journal-1', { description: 'updated' })).rejects.toThrow('Not yet implemented');
    await expect(journalPage.post('journal-1')).rejects.toThrow('Not yet implemented');
  });
});
