<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A span of the source a tree was read from, in bytes: from start up to, not including, end.
 */
final readonly class SourceRange
{
    public function __construct(
        public int $start,
        public int $end,
    ) {}

    /**
     * The same range moved by a number of bytes, as when a substitution's own positions become the whole line's.
     */
    public function shiftedBy(int $bytes): self
    {
        if ($bytes === 0) {
            return $this;
        }

        return new self($this->start + $bytes, $this->end + $bytes);
    }

    public function slice(string $source): string
    {
        return substr($source, $this->start, $this->end - $this->start);
    }
}
