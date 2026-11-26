<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Connections\HostOrderRefused;
use App\Models\Hosts\HostProcess;
use App\Time\Contracts\ServerClock;

/**
 * A process still waiting to be opened whose open order the host refused, or that expired unclaimed, never ran: it is
 * lost with the refusal as its evidence, so nothing waits on it.
 */
#[InCommandTransaction]
final readonly class LoseProcessOfRefusedOpening implements Listener
{
    public function __construct(private ServerClock $clock) {}

    public function handle(HostOrderRefused $fact): void
    {
        if (! $fact->type->isOpening() || $fact->processId === null) {
            return;
        }

        $process = HostProcess::findLocked($fact->processId);

        if ($process->isOrdered()) {
            $process->lose("the host refused to open it: {$fact->refusal->value}", $this->clock->now());
        }
    }
}
