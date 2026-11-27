<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Connections\HostInstructionRefused;
use App\Models\Hosts\HostProcess;
use App\Time\Contracts\ServerClock;

/**
 * A process still waiting to be opened whose open instruction the host refused, or that expired unclaimed, never ran: it is
 * lost with the refusal as its evidence, so nothing waits on it.
 */
#[InCommandTransaction]
final readonly class LoseProcessOfRefusedOpening implements Listener
{
    public function __construct(private ServerClock $clock) {}

    public function handle(HostInstructionRefused $fact): void
    {
        if (! $fact->type->isOpening() || $fact->processId === null) {
            return;
        }

        $process = HostProcess::findLocked($fact->processId);

        if ($process->isOrdered()) {
            $reason = $fact->reason === null ? '' : ", {$fact->reason}";
            $process->lose("the host refused to open it ({$fact->refusal->value}){$reason}", $this->clock->now());
        }
    }
}
