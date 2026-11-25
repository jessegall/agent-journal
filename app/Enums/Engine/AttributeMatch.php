<?php

declare(strict_types=1);

namespace App\Enums\Engine;

/**
 * How a selection of attributes matches an attribute class: by that exact class, or by it or anything that extends or
 * implements it, as PHP's ReflectionAttribute::IS_INSTANCEOF does.
 */
enum AttributeMatch: string
{
    case Exact = 'exact';
    case Implementing = 'implementing';

    public function selects(string $attribute, string $type): bool
    {
        return match ($this) {
            self::Exact => strcasecmp($attribute, ltrim($type, '\\')) === 0,
            self::Implementing => is_a($attribute, $type, true),
        };
    }
}
