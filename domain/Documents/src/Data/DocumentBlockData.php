<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One numbered line of a revision's text: its stable line number, which a comment on it keeps, and its text.
 */
#[TypeScript]
final class DocumentBlockData extends Data
{
    public function __construct(
        public readonly int $line,
        public readonly string $text,
    ) {}
}
