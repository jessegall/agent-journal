<?php

declare(strict_types=1);

namespace App\Navigation\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One destination a window's offer may send its record to, as the picker shows it.
 */
#[TypeScript]
final class WindowOfferChoiceData extends Data
{
    public function __construct(
        public readonly string $value,
        public readonly string $label,
    ) {}
}
