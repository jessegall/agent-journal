---
name: commandments-first-or-throw
description: Writing a query that throws when it finds no row, such as ->first() ?? throw TaskMissing::forId($id). Read this before you write ?? throw after a query.
---

# A query that throws says so in the query

```php
// Before
return self::query()->whereKey($id)->lockForUpdate()->first() ?? throw TaskMissing::forId($id);

// After
return self::query()->whereKey($id)->lockForUpdate()->firstOr(fn () => throw TaskMissing::forId($id));
```

Use `->firstOrFail()` when Laravel's own `ModelNotFoundException` is the failure the caller wants.
