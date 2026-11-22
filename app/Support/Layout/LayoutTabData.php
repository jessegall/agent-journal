<?php

declare(strict_types=1);

namespace App\Support\Layout;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One tab of a tab set: the key its window's query names to choose it, its label, and whether it is the one shown.
 */
#[TypeScript]
final class LayoutTabData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly bool $isChosen,
    ) {}
}
