<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\WordSegmentType;

/**
 * One shell word as its segments in order, so an empty quoted argument or "a"b adjacency is kept.
 */
final readonly class Word
{
    /**
     * @param  list<WordSegment>  $segments
     */
    public function __construct(
        public array $segments,
        public SourceRange $range,
    ) {}

    /**
     * Whether a segment expands at run time, so the word's text is not known from the source alone.
     */
    public function hasExpansion(): bool
    {
        foreach ($this->segments as $segment) {
            if ($segment->type === WordSegmentType::Expansion) {
                return true;
            }
        }

        return false;
    }

    /**
     * The same word with every position moved by a number of bytes.
     */
    public function shiftedBy(int $bytes): self
    {
        return $bytes === 0 ? $this : new self(array_map(fn (WordSegment $segment) => $segment->shiftedBy($bytes), $this->segments), $this->range->shiftedBy($bytes));
    }

    /**
     * The word's text, which only a word without expansions has.
     */
    public function literal(): string|null
    {
        return $this->hasExpansion() ? null : implode('', array_map(fn (WordSegment $segment) => $segment->text, $this->segments));
    }
}
