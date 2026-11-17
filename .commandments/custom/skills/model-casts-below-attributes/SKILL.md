---
name: ModelCastsBelowAttributes
description: Writing or editing an Eloquent model's casts() method, or adding a method to a model that has one. Read this before you place casts() anywhere but first among the model's methods.
summary: A model's casts() sits directly below its attributes, as its first method.
tier: keep-in-mind
languages: [php]
---

# A model's casts() sits directly below its attributes

`casts()` says what each column of the model holds: an id is an integer, a state is an enum, a time is a date. It
belongs with the rest of what describes the model's columns, the `#[Fillable]` and other class attributes, the
constants and the properties, so a reader sees the whole shape of a row in one place before any behaviour.

Put `casts()` first among the model's methods, directly below its constants and properties:

```php
#[Fillable(['text', 'weight'])]
final class Memory extends Model
{
    use OwnedByOneAgent;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['agent_id' => 'integer', 'weight' => 'integer'];
    }

    public function saveFor(int $agentId): void
    {
        // ...
    }
}
```

Never after another method: a `casts()` at the bottom of a model hides the column types behind everything the model
does.
