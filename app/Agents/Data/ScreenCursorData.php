<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where the terminal's cursor is and whether the program shows it.
 */
#[TypeScript]
final class ScreenCursorData extends Data
{
    public function __construct(
        public readonly int $row,
        public readonly int $column,
        public readonly bool $visible,
    ) {}
}
