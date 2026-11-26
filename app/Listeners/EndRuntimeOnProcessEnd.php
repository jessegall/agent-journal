<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Commands\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Hosts\HostRuntimes;
use App\Models\Hosts\HostProcess;

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

        $process = HostProcess::query()->whereKey($fact->processId)->sole();

        if (! $process->purpose->isRuntimeProcess()) {
            return;
        }

        $hostId = $process->host_id;
        $generation = $this->runtimes->lockedFor($hostId, $fact->runtimeId)->process_generation;
        $this->commands->run(new NotifyRuntimeExitCommand($hostId, $fact->runtimeId, $generation, $fact->evidence));
    }
}
