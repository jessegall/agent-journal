<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Events\DriverFailed;
use App\Models\Drivers\FailureReceipt;
use App\Models\Starts\ProcessStart;
use App\Support\Inputs\FailureDetails;
use App\Support\Inputs\Values\HookIdentity;

/**
 * Receives a driver's failure notification once per native event and publishes it as a safe fact; a retry of the
 * same event publishes nothing.
 */
final readonly class RecordDriverFailure
{
    public function __construct(private CommandFacts $facts) {}

    public function record(HookIdentity $hook, FailureDetails $details): void
    {
        if (! FailureReceipt::receive($hook, $details->failure)) {
            return;
        }

        $start = ProcessStart::latestOfSession($hook->sessionId);

        $failed = new DriverFailed(
            $hook->agentId,
            $hook->sessionId,
            $details->driver,
            $details->failure,
            $start?->accountIdentity,
            $start?->account_generation,
        );

        $this->facts->publishAfterCommit($failed);
    }
}
