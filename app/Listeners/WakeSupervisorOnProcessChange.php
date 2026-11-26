<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Hosts\Contracts\HostProcessEvent;
use App\Hosts\HostWake;

/**
 * Once a change of a host's process is committed, the worker supervisor looks again at which processes need a worker.
 */
final readonly class WakeSupervisorOnProcessChange implements Listener
{
    public function __construct(private HostWake $wake) {}

    public function handle(HostProcessEvent $fact): void
    {
        $this->wake->wakeSupervisor();
    }
}
