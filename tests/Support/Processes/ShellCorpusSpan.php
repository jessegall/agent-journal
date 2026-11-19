<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use Spatie\LaravelData\Data;

/**
 * The byte span of one command a corpus line runs.
 */
final class ShellCorpusSpan extends Data
{
    public function __construct(public readonly int $start, public readonly int $end) {}

    /**
     * Orders two spans by where they start, then by where they end.
     */
    public function compare(self $other): int
    {
        return [$this->start, $this->end] <=> [$other->start, $other->end];
    }
}
