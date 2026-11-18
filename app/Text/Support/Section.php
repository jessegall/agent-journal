<?php

declare(strict_types=1);

namespace App\Text\Support;

/**
 * One section of a text: its number in this text, its heading level and heading (none for the preamble), and its
 * first and last line.
 */
final readonly class Section
{
    public function __construct(
        public int $number,
        public int $level,
        public string $heading,
        public int $firstLine,
        public int $lastLine,
    ) {}
}
