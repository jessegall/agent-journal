<?php

declare(strict_types=1);

namespace App\Support\Layout;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A measured reading: how far a value is of its maximum, what it measures and the unit its numbers are in, such as
 * 72 of 100 percent of a weekly allowance, or 3 of 8 tasks finished.
 */
#[TypeScript]
final class LayoutProgressData extends Data
{
    public function __construct(
        public readonly float $value,
        public readonly float $max,
        public readonly string $label,
        public readonly string $unit,
    ) {}
}
