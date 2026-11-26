<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Time\ServerClock;
use App\Events\Connections\HostProcessRestarted;
use App\Models\Hosts\HostProcess;
use App\Support\HostRuntimes;

/**
 * A healed agent process starts its runtime's next process generation, so reports of the crashed one are refused.
 */
#[InCommandTransaction]
final readonly class RestartDriverOnHeal implements Listener
{
    public function __construct(private HostRuntimes $runtimes, private ServerClock $clock) {}

    public function handle(HostProcessRestarted $fact): void
    {
        if ($fact->runtimeId === null) {
            return;
        }

        $hostId = HostProcess::query()->whereKey($fact->processId)->sole()->host_id;
        $this->runtimes->lockedFor($hostId, $fact->runtimeId)->beginProcessGeneration($this->clock->now());
    }
}
