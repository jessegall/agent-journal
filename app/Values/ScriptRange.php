<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Data;

/**
 * Where a piece of a script stands in its source: its line, column and length.
 */
final class ScriptRange extends Data
{
    public function __construct(
        public readonly int $line,
        public readonly int $column,
        public readonly int $length,
    ) {}
}
