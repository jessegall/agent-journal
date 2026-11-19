---
name: LineWidth
description: Writing a PHP line that runs past 120 characters, or fixing a line-too-wide finding. Read this before you break a long call, signature or condition.
summary: No PHP line goes past 120 characters.
tier: keep-in-mind
languages: [php]
---

# No PHP line goes past 120 characters

A line that runs past the edge of the editor hides its end, and its end is often the argument that matters. Pint does
not wrap long lines, so the writer does.

Break a long call or signature one argument per line, with a trailing comma:

```php
return new LaunchAgent(new LaunchRequest(
    $requestId,
    $agentId,
    $selection,
));
```

When the line is long because one argument is an expression, name that expression first:

```php
$forms = [$this->subject, $this->purposeId, $this->purposeText];

return count(array_filter($forms, fn ($form) => $form !== null));
```

A long condition is a question with a name: move it into a method that answers it. A long string is split at a word
and joined with a dot. Lines already too wide are fixed when their file is next changed.
