---
name: commandments-morph-key-constant
description: Writing a Spatie Data morph() that reads its $properties array, the raw values the library hands a PropertyMorphableData before any Data exists. Read this before you write $properties['type'] in a morph().
---

# A morph reads its key through one constant

`morph(array $properties)` is the library's signature: the properties arrive as an array before any Data object
exists, so the key into it is the name of the `#[PropertyForMorph]` property. Written as a string it goes stale
unseen when the property is renamed, and nothing fails until a full run reads that answer.

```php
// Before
#[PropertyForMorph]
public AdmissionStatus $status;

public static function morph(array $properties): string
{
    return $properties['state']->answerClass();
}

// After
private const string MORPHED_BY = 'status';

#[PropertyForMorph]
public AdmissionStatus $status;

public static function morph(array $properties): string
{
    return $properties[self::MORPHED_BY]->answerClass();
}
```

The constant sits beside the property it names, and an architecture test (MorphKeyConstantTest) fails when its
value names no `#[PropertyForMorph]` property of the class.
