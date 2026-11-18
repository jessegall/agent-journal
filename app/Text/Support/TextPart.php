<?php

declare(strict_types=1);

namespace App\Text\Support;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The lines a read returns, the range they come from, and the line the next part starts at when the read was cut
 * at its bound.
 */
#[TypeScript]
final class TextPart extends Data
{
    public const int LINES = 200;

    public const int BYTES = 16_384;

    public function __construct(
        public readonly string $text,
        public readonly int $firstLine,
        public readonly int $lastLine,
        public readonly int|null $nextLine,
    ) {}

    /**
     * The part as safe HTML, each block marked with its line in the whole text.
     */
    public function toSafeHtml(): string
    {
        return MarkdownText::body($this->text)->toSafeHtml($this->firstLine);
    }
}
