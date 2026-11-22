<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Neighbouring cells of one screen row that share one style.
 */
#[TypeScript]
final class ScreenRunData extends Data
{
    public function __construct(
        public readonly string $text,
        public readonly ScreenStyleData $style = new ScreenStyleData(),
    ) {}
}
