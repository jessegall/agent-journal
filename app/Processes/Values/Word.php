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

    /**
     * The same word with each positional parameter ($1 or ${1}) replaced by its bound value as a quoted segment, so a
     * value is one word and never shell text.
     *
     * @param  list<string>  $positional
     */
    public function boundTo(array $positional): self
    {
        if ($positional === []) {
            return $this;
        }

        return new self(array_map(function (WordSegment $segment) use ($positional): WordSegment {
            if ($segment->type !== WordSegmentType::Expansion || preg_match('/^\$\{?([1-9])\}?$/', $segment->text, $match) !== 1 || ! isset($positional[(int) $match[1] - 1])) {
                return $segment;
            }

            return new WordSegment(WordSegmentType::SingleQuoted, $positional[(int) $match[1] - 1], $segment->range);
        }, $this->segments), $this->range);
    }
}
