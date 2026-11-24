<?php

declare(strict_types=1);

namespace App\Data\Terminals;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How a run of screen cells is drawn: its colours as #rrggbb, none for the terminal's default, and its attributes.
 */
#[TypeScript]
final class ScreenStyleData extends Data
{
    public function __construct(
        public readonly string|null $fg = null,
        public readonly string|null $bg = null,
        public readonly bool $isBold = false,
        public readonly bool $isItalic = false,
        public readonly bool $isUnderlined = false,
        public readonly bool $isInverse = false,
    ) {}
}
