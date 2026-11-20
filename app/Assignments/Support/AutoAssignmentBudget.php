<?php

declare(strict_types=1);

namespace App\Assignments\Support;

/**
 * What one engine pass may spend on filling auto-assignments: the monotonic reading it must stop by, how many enabled
 * facts it reads and how many it claims for, and the fact id it starts after. Holding one grants no authority.
 */
final readonly class AutoAssignmentBudget
{
    public function __construct(
        public int $stopNanoseconds,
        public int $factLimit,
        public int $claimLimit,
        public string|null $afterId,
    ) {}

    /**
     * Whether the budget allows no read or no claim at all.
     */
    public function isEmpty(): bool
    {
        return $this->factLimit < 1 || $this->claimLimit < 1;
    }
}
