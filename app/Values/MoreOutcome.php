<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\BatchOutcome;

/**
 * The source certifies that every hit it returned precedes all hits it has left, and seeks on from the next seek.
 */
final readonly class MoreOutcome implements BatchOutcome
{
    public function __construct(public SourcePosition $nextSeek) {}

    public function carriesHits(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'more';
    }
}
