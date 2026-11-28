<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Handling;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Commands\OpenHeadlessTurn\OpenHeadlessTurnCommand;
use App\Agents\Drivers\Commands\OpenJournalStart\OpenJournalStartCommand;
use App\Agents\Drivers\Contracts\RuntimeHandling;
use App\Bus\Contracts\JournalCommands;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;

/**
 * A driver whose agent runs one turn at a time, each a process the journal opens: its start opens at registration,
 * its next turn opens once the start is proven, and a turn ends alone while its start goes on.
 */
final readonly class TurnHandling implements RuntimeHandling
{
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(private JournalCommands $commands, private StartRefusals $refusals) {}

    public function openStart(AgentRuntime $runtime): void
    {
        $open = new OpenJournalStartCommand($runtime->agent_session_id);
        $this->commands->runAsJournal(CommandEntry::DriverWorker, self::TRUSTED_ENTRY, $open);
    }

    public function continueAgent(AgentRuntime $runtime): void
    {
        $open = new OpenHeadlessTurnCommand($runtime->id);
        $this->commands->runAsJournal(CommandEntry::DriverWorker, self::TRUSTED_ENTRY, $open);
    }

    public function endWith(HostProcess $process, HostProcessEndEvent $fact): void
    {
        // A turn ends alone: the start it ran for goes on, and its next turn opens for the work that waits.
        if ($process->purpose === HostProcessPurpose::AgentTurn) {
            return;
        }

        $this->refusals->refuseUnstarted($process, $fact);
    }

    public function isRunByJournal(): bool
    {
        return true;
    }

    public function isWakeSettledByActivity(): bool
    {
        return false;
    }
}
