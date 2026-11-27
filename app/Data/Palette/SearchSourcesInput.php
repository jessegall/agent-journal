<?php

declare(strict_types=1);

namespace App\Data\Palette;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which sources the palette's scope picker asks for: those whose name starts with the prefix, after the one named.
 */
#[TypeScript]
final class SearchSourcesInput extends Data
{
    public function __construct(
        public readonly string $prefix = '',
        public readonly string|null $after = null,
    ) {}
}
