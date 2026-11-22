<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\WordSegmentType;

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
        if ($bytes === 0) {
            return $this;
        }

        $segments = array_map(fn (WordSegment $segment) => $segment->shiftedBy($bytes), $this->segments);

        return new self($segments, $this->range->shiftedBy($bytes));
    }

    /**
     * The word's text, which only a word without expansions has.
     */
    public function literal(): string|null
    {
        if ($this->hasExpansion()) {
            return null;
        }

        return implode('', array_map(fn (WordSegment $segment) => $segment->text, $this->segments));
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

        $segments = array_map(fn (WordSegment $segment) => $this->bindSegment($segment, $positional), $this->segments);

        return new self($segments, $this->range);
    }

    /**
     * A positional parameter segment with a bound value becomes that value, single-quoted; any other stays as it is.
     *
     * @param  list<string>  $positional
     */
    private function bindSegment(WordSegment $segment, array $positional): WordSegment
    {
        if ($segment->type !== WordSegmentType::Expansion) {
            return $segment;
        }

        if (preg_match('/^\$\{?([1-9])\}?$/', $segment->text, $match) !== 1) {
            return $segment;
        }

        $index = (int) $match[1] - 1;

        if (! isset($positional[$index])) {
            return $segment;
        }

        return new WordSegment(WordSegmentType::SingleQuoted, $positional[$index], $segment->range);
    }

    /**
     * Whether the word starts as NAME= or NAME+=, an assignment before a command.
     */
    public function isAssignment(): bool
    {
        if ($this->segments === [] || $this->segments[0]->type !== WordSegmentType::Literal) {
            return false;
        }

        return preg_match('/^[A-Za-z_][A-Za-z0-9_]*\+?=/', $this->segments[0]->text) === 1;
    }

    /**
     * Whether the word is one segment ending in =, the name part before the ( of an array assignment.
     */
    public function isArrayName(): bool
    {
        return count($this->segments) === 1 && str_ends_with($this->segments[0]->text, '=');
    }
}
