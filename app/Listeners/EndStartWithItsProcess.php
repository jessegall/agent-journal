<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Commands\NotifyStopped\NotifyStoppedCommand;
use App\Agents\Drivers\Work\HeadlessStarts;
use App\Attributes\Listeners\InCommandTransaction;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\Connections\HostProcessLost;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;

/**
 * An ended host process ends its start: one that never ran refuses it with why, a terminal that ran stops it so its
 * account holds are released, unless the journal opens it again once lost; a headless turn leaves its start running.
 */
#[InCommandTransaction]
final readonly class EndStartWithItsProcess implements Listener
{
    public function __construct(private CommandBus $commands, private HeadlessStarts $starts) {}

    public function handle(HostProcessEndEvent $fact): void
    {
        $process = HostProcess::query()->whereKey($fact->processId)->sole();

        // A headless turn ends alone: the start it ran for goes on, and its next turn opens for the work that waits.
        if ($process->session_process_id === null || $process->purpose === HostProcessPurpose::AgentTurn) {
            return;
        }

        $start = SessionProcess::findLockedById($process->session_process_id);

        if ($process->started_at === null) {
            $start->refuse($fact->evidence);

            return;
        }

        // A journal terminal lost with its host is opened again for the same start, so the start goes on.
        if ($fact instanceof HostProcessLost && $this->starts->opensAgainWhenLost($process)) {
            return;
        }

        if ($process->purpose === HostProcessPurpose::AgentTerminal) {
            $this->commands->run(new NotifyStoppedCommand($process->host_id, $start->start_key));
        }
    }
}
