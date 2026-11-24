<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Exceptions\WorkBudgetSpent;

/**
 * The work one search provider call may still do. A provider charges each piece of work before the read that does
 * it, so a call that would go past its allowance stops before it reads.
 */
interface WorkAllowance
{
    /**
     * The same allowance, unspent, for the next call: its time runs again from now.
     */
    public function renewed(): self;

    /**
     * @throws WorkBudgetSpent
     */
    public function chargeCandidates(int $count): void;

    /**
     * @throws WorkBudgetSpent
     */
    public function chargeRelationships(int $count): void;

    /**
     * @throws WorkBudgetSpent
     */
    public function chargePolicyChecks(int $count): void;

    /**
     * @throws WorkBudgetSpent
     */
    public function chargeBytes(int $count): void;

    /**
     * How many candidates the work has looked at so far.
     */
    public function spentCandidates(): int;

    /**
     * How many bytes the work has read so far.
     */
    public function spentBytes(): int;

    /**
     * How many more candidates the work may look at.
     */
    public function remainingCandidates(): int;

    /**
     * How many bytes the work may still read.
     */
    public function remainingBytes(): int;

    /**
     * Whether the work may still run on.
     */
    public function hasTimeLeft(): bool;

    /**
     * How many milliseconds the work may still run.
     */
    public function remainingMilliseconds(): int;
}
