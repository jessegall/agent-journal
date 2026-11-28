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

    public function isShellTest(): bool
    {
        return $this->type === WordSegmentType::Literal
            && str_starts_with($this->text, '[[ ')
            && str_ends_with($this->text, ']]');
    }

    public function canContainSubstitution(): bool
    {
        return $this->type === WordSegmentType::Expansion || $this->isShellTest();
    }
}
