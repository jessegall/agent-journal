<?php

declare(strict_types=1);

namespace App\Agents\Data;

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
        public readonly bool $bold = false,
        public readonly bool $italic = false,
        public readonly bool $underline = false,
        public readonly bool $inverse = false,
    ) {}
}
