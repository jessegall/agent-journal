<?php

declare(strict_types=1);

namespace App\Hooks\Support;

/**
 * How many hook calls and closed stacks one pruning removed, and how many stop results lost their raw output.
 */
final readonly class PrunedHistory
{
    public function __construct(
        public int $hookCalls,
        public int $closedStacks,
        public int $stopOutputs,
    ) {}
}
