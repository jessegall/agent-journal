<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Handling;

use App\Agents\Drivers\Commands\NotifyStopped\NotifyStoppedCommand;
use App\Agents\Drivers\Contracts\RuntimeHandling;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;

/**
 * A driver its host runs: the host claims the start and opens what it runs, so the journal opens nothing; a turn ends
 * alone, a process that never ran refuses its start, and a terminal that ran, lost or not, stops it.
 */
final readonly class HostHandling implements RuntimeHandling
{
    public function __construct(private CommandBus $bus, private StartRefusals $refusals) {}

    public function openStart(AgentRuntime $runtime): void {}

    public function continueAgent(AgentRuntime $runtime): void {}

    public function endWith(HostProcess $process, HostProcessEndEvent $fact): void
    {
        if ($process->purpose === HostProcessPurpose::AgentTurn || $this->refusals->refuseUnstarted($process, $fact)) {
            return;
        }

        if ($process->purpose === HostProcessPurpose::AgentTerminal && $process->session_process_id !== null) {
            $start = SessionProcess::findLockedById($process->session_process_id);
            $this->bus->run(new NotifyStoppedCommand($process->host_id, $start->start_key));
        }
    }

    public function isRunByJournal(): bool
    {
        return false;
    }

    public function isWakeSettledByActivity(): bool
    {
        return true;
    }

    public function isRuntimeEndedBy(HostProcessEndEvent $fact): bool
    {
        return true;
    }
}
