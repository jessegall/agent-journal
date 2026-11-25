<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Contracts\Agents\AgentNotices as AgentNoticesContract;
use App\Contracts\Bus\JournalCommands;
use App\Enums\Accounts\CommandEntry;
use App\Models\Agents\AgentSession;

/**
 * Delivers a journal notice as text to the agent's running session, under a key that makes a repeat the same
 * delivery.
 */
final readonly class AgentNotices implements AgentNoticesContract
{
    public const string TRUSTED_ENTRY = 'agent notice';

    public function __construct(private JournalCommands $journal) {}

    public function notify(string $agentId, string $text, string $key): void
    {
        $session = AgentSession::findLiveOf($agentId);

        if ($session !== null) {
            $this->journal->runAsJournal(
                CommandEntry::Application,
                self::TRUSTED_ENTRY,
                DeliverAgentCommand::text($agentId, $session->id, $key, $text),
            );
        }
    }
}
