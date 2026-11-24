<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Enums\DocumentBlockType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One block of a revision's text as the reader draws it: its type, its text, and the first and last line of the
 * revision it was read from, which a comment on it keeps.
 */
#[TypeScript]
final class DocumentBlockData extends Data
{
    public function __construct(
        public readonly DocumentBlockType $type,
        public readonly string $text,
        public readonly int $firstLine,
        public readonly int $lastLine,
    ) {}
}
