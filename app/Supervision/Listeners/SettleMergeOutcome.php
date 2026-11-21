<?php

declare(strict_types=1);

namespace App\Supervision\Listeners;

use App\Agents\Events\MergeOutcomeRecorded;
use App\Agents\Models\MergeAttempt;
use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Supervision\Support\MergeSettlement;

/**
 * Settles a merge ask as soon as its attempt ends; the engine's sweep settles any this did not reach.
 */
#[InCommandTransaction]
final readonly class SettleMergeOutcome implements Listener
{
    public function __construct(private MergeSettlement $settlement) {}

    public function handle(MergeOutcomeRecorded $event): void
    {
        $this->settlement->settle(MergeAttempt::lockedById($event->attemptId));
    }
}
