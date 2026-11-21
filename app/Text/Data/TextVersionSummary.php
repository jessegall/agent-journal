<?php

declare(strict_types=1);

namespace App\Text\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One version of a record's text, without its text: its id, the label people read, and how many source lines it has.
 */
#[TypeScript]
final class TextVersionSummary extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $label,
        public readonly int $lineCount,
    ) {}
}
