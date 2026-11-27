<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Commands\NotifyRunning\NotifyRunningCommand;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\Connections\HostProcessStarted;
use App\Models\Hosts\HostProcess;

/**
 * A host process that runs for a start, once it runs, moves that start to running under the process's identity, as
 * the host's running report did: its driver switch is confirmed and its driver type kept.
 */
final readonly class RunStartWithItsProcess implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(HostProcessStarted $fact): void
    {
        $process = HostProcess::query()->withSessionProcess()->whereKey($fact->processId)->sole();
        $start = $process->sessionProcess;

        // A probe runs before the start's agent does: only the agent's own process moves the start to running.
        if ($start !== null && ! $process->purpose->isProbe()) {
            $this->commands->run(new NotifyRunningCommand($process->host_id, $start->start_key, $fact->identity));
        }
    }
}
