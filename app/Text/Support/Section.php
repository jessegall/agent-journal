<?php

declare(strict_types=1);

namespace App\Text\Support;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One section of a text: its number in this text, its heading level and heading (none for the preamble), and its
 * first and last line.
 */
#[TypeScript]
final class Section extends Data
{
    public function __construct(
        public readonly int $number,
        public readonly int $level,
        public readonly string $heading,
        public readonly int $firstLine,
        public readonly int $lastLine,
    ) {}
}
