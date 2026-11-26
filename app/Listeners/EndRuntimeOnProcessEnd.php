<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\Agents\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\Listener;
use App\Contracts\Hosts\HostProcessEndEvent;
use App\Models\Hosts\HostProcess;
use App\Support\HostRuntimes;

/**
 * An agent's process that exited or was lost ends its runtime's process generation, as a driver's exit report does.
 */
final readonly class EndRuntimeOnProcessEnd implements Listener
{
    public function __construct(private CommandBus $commands, private HostRuntimes $runtimes) {}

    public function handle(HostProcessEndEvent $fact): void
    {
        if ($fact->runtimeId === null) {
            return;
        }

        $hostId = HostProcess::query()->whereKey($fact->processId)->sole()->host_id;
        $generation = $this->runtimes->lockedFor($hostId, $fact->runtimeId)->process_generation;
        $this->commands->run(new NotifyRuntimeExitCommand($hostId, $fact->runtimeId, $generation, $fact->evidence));
    }
}
