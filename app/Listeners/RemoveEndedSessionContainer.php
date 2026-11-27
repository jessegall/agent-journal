<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Listeners\InCommandTransaction;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Events\Sessions\AgentSessionEnded;
use App\Hosts\Commands\RemoveSessionContainer\RemoveSessionContainerCommand;
use App\Models\Agents\AgentRuntime;

/**
 * A session of a contained host that ends has its network and plan files removed from the agent daemon, once,
 * after its last turn.
 */
#[InCommandTransaction]
final readonly class RemoveEndedSessionContainer implements Listener
{
    private const string TRUSTED_ENTRY = 'removing what an ended session left';

    public function __construct(private JournalCommands $commands) {}

    public function handle(AgentSessionEnded $fact): void
    {
        $runtime = AgentRuntime::findForSession($fact->sessionId);

        if ($runtime === null || ! $runtime->runsContained()) {
            return;
        }

        $this->commands->runAsJournal(
            CommandEntry::HostControl,
            self::TRUSTED_ENTRY,
            new RemoveSessionContainerCommand($runtime->host_id, $fact->sessionId),
        );
    }
}
