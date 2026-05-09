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

import { describe, expect, it } from 'vitest';

import { test } from '../src/fixtures/index.js';

describe('accounting fixture composition', () => {
  it('test object has ledgerPage fixture', () => {
    const extended = test.extend<{ ledgerFixtureIsWired: boolean }>({
      ledgerFixtureIsWired: async ({ ledgerPage }, use) => {
        await use(Boolean(ledgerPage));
      },
    });

    expect(extended).toBeDefined();
  });

  it('test object has journalPage fixture', () => {
    const extended = test.extend<{ journalFixtureIsWired: boolean }>({
      journalFixtureIsWired: async ({ journalPage }, use) => {
        await use(Boolean(journalPage));
      },
    });

    expect(extended).toBeDefined();
  });
});
