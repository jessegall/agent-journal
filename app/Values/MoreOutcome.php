<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Bus\BatchOutcome;

/**
 * The source certifies that every hit it returned precedes all hits it has left, and seeks on from the next seek.
 */
final readonly class MoreOutcome implements BatchOutcome
{
    public function __construct(public SourcePosition $nextSeek) {}

    public function canCarryHits(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'more';
    }

    public function isFailure(): bool
    {
        return false;
    }

    public function nextPosition(): SourcePosition
    {
        return $this->nextSeek;
    }

    public function isLastBatch(): bool
    {
        return false;
    }
}
