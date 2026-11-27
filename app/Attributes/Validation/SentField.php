<?php

declare(strict_types=1);

namespace App\Attributes\Validation;

use Attribute;
use Spatie\LaravelData\Attributes\Validation\StringValidationAttribute;
use Spatie\LaravelData\Support\Validation\RequiringRule;

/**
 * A field a call always sends, which may be empty: it must be present, where required would refuse an empty text or
 * list.
 */
#[Attribute(Attribute::TARGET_PROPERTY | Attribute::TARGET_PARAMETER)]
final class SentField extends StringValidationAttribute implements RequiringRule
{
    public static function keyword(): string
    {
        return 'present';
    }

    /**
     * @return array<int, mixed>
     */
    public function parameters(): array
    {
        return [];
    }
}
