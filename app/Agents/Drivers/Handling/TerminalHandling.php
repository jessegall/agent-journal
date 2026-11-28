<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Handling;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Commands\OpenHeadlessStart\OpenHeadlessStartCommand;
use App\Agents\Commands\OpenJournalTerminal\OpenJournalTerminalCommand;
use App\Agents\Drivers\Commands\NotifyStopped\NotifyStoppedCommand;
use App\Agents\Drivers\Contracts\RuntimeHandling;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\JournalCommands;
use App\Events\Connections\HostProcessLost;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;

/**
 * A driver whose agent runs in a terminal the journal opens: its start opens at registration, its terminal opens once
 * the start is proven, a terminal lost with its host is opened again so its start goes on, and one that ended stops
 * its start.
 */
final readonly class TerminalHandling implements RuntimeHandling
{
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(
        private JournalCommands $commands,
        private CommandBus $bus,
        private StartRefusals $refusals,
    ) {}

    public function openStart(AgentRuntime $runtime): void
    {
        $open = new OpenHeadlessStartCommand($runtime->agent_session_id);
        $this->commands->runAsJournal(CommandEntry::DriverWorker, self::TRUSTED_ENTRY, $open);
    }

    public function continueAgent(AgentRuntime $runtime): void
    {
        $open = new OpenJournalTerminalCommand($runtime->id);
        $this->commands->runAsJournal(CommandEntry::DriverWorker, self::TRUSTED_ENTRY, $open);
    }

    public function endWith(HostProcess $process, HostProcessEndEvent $fact): void
    {
        if ($this->refusals->refuseUnstarted($process, $fact) || $fact instanceof HostProcessLost) {
            return;
        }

        if ($process->purpose === HostProcessPurpose::AgentTerminal && $process->session_process_id !== null) {
            $start = SessionProcess::findLockedById($process->session_process_id);
            $this->bus->run(new NotifyStoppedCommand($process->host_id, $start->start_key));
        }
    }

    public function isRunByJournal(): bool
    {
        return true;
    }
}
