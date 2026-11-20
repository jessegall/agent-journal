<?php

declare(strict_types=1);

namespace App\Text\Support;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which part of a record's text a read asks for: a section, a line range, only its bullets, only the lines holding
 * some words, and whether the whole of it is wanted past the usual bound. Asking for none of them reads the outline.
 */
#[TypeScript]
final class TextSelection extends Data
{
    public function __construct(
        public readonly string|null $section = null,
        public readonly int|null $firstLine = null,
        public readonly int|null $lastLine = null,
        public readonly bool $bullets = false,
        public readonly string|null $words = null,
        #[MapName('all')]
        public readonly bool $isWholeText = false,
    ) {}

    public function isOutlineOnly(): bool
    {
        return $this->section === null
            && $this->firstLine === null
            && ! $this->bullets
            && $this->words === null
            && ! $this->isWholeText;
    }
}
