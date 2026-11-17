<?php

declare(strict_types=1);

namespace App\Core\Hooks;

/**
 * How many hook calls and closed stacks one pruning removed.
 */
final readonly class PrunedHistory
{
    public function __construct(
        public int $hookCalls,
        public int $closedStacks,
    ) {}
}
