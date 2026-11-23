<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\MergeOutcomeRecorded;
use App\Models\Reviews\MergeAttempt;
use App\Support\MergeSettlement;

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
