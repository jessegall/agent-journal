---
name: commandments-mixed-condition-checks
description: Writing a condition that checks one object twice, one check named as a boolean local and the other inline. Read this before you combine a named check with an inline call on the same object.
---

# Every check of one object in a condition is written the same way

A condition that names one check of an object and calls the next one inline reads as two styles in one line. Name
both, or write both inline.

```php
// Before
$isAdapter = $type->is(PipelineAdapter::class);

if ($type->isSubclassOf(Pipe::class) && ! $isAdapter && self::reachesPipelines($class, [])) {

// After: each check named
$isAdapter = $type->is(PipelineAdapter::class);
$isPipe = $type->isSubclassOf(Pipe::class);

if ($isPipe && ! $isAdapter && self::reachesPipelines($class, [])) {
```

Write both inline instead when each is used once and the condition stays readable:
`if ($type->isSubclassOf(Pipe::class) && ! $type->is(PipelineAdapter::class))`.
