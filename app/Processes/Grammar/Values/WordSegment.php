<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Values;

use App\CommandRules\Enums\WordSegmentType;

/**
 * One piece of a word with how it was written; text holds what the piece means, without its quotes or backslash.
 */
final readonly class WordSegment
{
    public function __construct(
        public WordSegmentType $type,
        public string $text,
        public SourceRange $range,
    ) {}

    public function shiftedBy(int $bytes): self
    {
        return clone ($this, ['range' => $this->range->shiftedBy($bytes)]);
    }
}
