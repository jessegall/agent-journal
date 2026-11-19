<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Agents\Events\ProgramFailed;
use App\Agents\Models\ProcessStart;
use App\Hooks\Inputs\FailureDetails;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\FailureReceipt;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Hears a program's failure notification once per native event and publishes it as a safe fact; a retry of the
 * same event publishes nothing.
 */
final readonly class RecordProgramFailure
{
    public function __construct(private Dispatcher $events) {}

    public function record(HookIdentity $hook, FailureDetails $details): void
    {
        if (! FailureReceipt::receive($hook, $details->failure)) {
            return;
        }

        $start = ProcessStart::latestOfSession($hook->sessionId);
        $failed = new ProgramFailed(
            $hook->agentId,
            $hook->sessionId,
            $details->program,
            $details->failure,
            $start?->accountIdentity(),
            $start?->account_generation,
        );
        $this->events->dispatch($failed);
    }
}
