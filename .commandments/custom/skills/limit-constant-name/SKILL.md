---
name: commandments-limit-constant-name
description: Naming a constant that holds a maximum or a minimum, such as the most characters a title holds, or reading a value from an enum or class named *Limit into a constant. Read this before you declare one.
---

# A limit constant says limit

A constant that holds the most, the longest or the fewest of something is a limit, and its name says so: it ends
in `LIMIT` (or `MAX`, `MINIMUM` where that reads better).

```php
// Before
/** The most characters a task's title holds. */
public const int TITLE_CHARACTERS = TaskTextLimit::Title->value;

// After
/** The most characters a task's title holds. */
public const int TITLE_CHARACTER_LIMIT = TaskTextLimit::Title->value;
```

Rename with the rename tools, so every caller and test follows.
