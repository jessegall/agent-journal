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

    public function spentCandidates(): int;

    public function spentBytes(): int;

    public function remainingCandidates(): int;

    public function remainingBytes(): int;

    public function hasTimeLeft(): bool;

    public function remainingMilliseconds(): int;
}
