---
name: BoundedReads
description: Reading rows in this project: a Model::all, a DB facade read, toBase or getQuery, a find or first inside a loop, a query in an accessor, or a timing assertion in a test. Read this before writing any of them, and when a bounded-reads finding points here.
summary: Every read is bounded, goes through its model, and reads what a loop needs once.
tier: keep-in-mind
languages: [php]
---

# Every read is bounded, goes through its model, and reads once

A read that grows with the data, or runs once per item, is the slowest code in the journal and the hardest to see.
The Reads area (app/Reads) caps plain reads at 50 rows and makes a larger read name itself; these rules keep code
from stepping around it.

- **No Model::all().** Read a page, `readLimit(n)`, `readAll('why every row')` or `readInChunks(n)`.
- **No DB facade reads.** A table is read through its model, its scopes and its readers (rule 25).
- **No toBase() or getQuery().** They leave the bounded builder; only app/Reads may use them.
- **No find, first or sole inside a loop.** Read every row the loop needs in one query before it (`whereKey($ids)`,
  `whereIn`, `with`), or walk a large set with `readInChunks`.
- **No query in an accessor.** An accessor computes from what is loaded; load the relation with `with()` first.
- **No timing assertions in tests.** Assert counts, states and refusals; the ceiling on a test's run is
  `#[TimeLimit]`.

```php
// Before: one query per id
foreach ($ids as $id) {
    $titles[] = Task::query()->findOrFail($id)->title;
}

// After: one query for all of them
$titles = Task::query()->whereKey($ids)->readLimit(count($ids))->pluck('title')->all();
```
