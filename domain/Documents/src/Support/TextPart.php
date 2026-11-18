<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

/**
 * The lines a read returns, the range they come from, and the line the next part starts at when the read was cut
 * at its bound.
 */
final readonly class TextPart
{
    public const int LINES = 200;

    public const int BYTES = 16_384;

    public function __construct(
        public string $text,
        public int $firstLine,
        public int $lastLine,
        public int|null $nextLine,
    ) {}
}
