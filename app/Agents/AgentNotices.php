<?php

declare(strict_types=1);

namespace App\Agents;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Contracts\AgentNotices as AgentNoticesContract;
use App\Bus\Contracts\JournalCommands;
use App\Models\Agents\AgentSession;

/**
 * Delivers a journal notice as text to the agent's running session, under a key that makes a repeat the same
 * delivery.
 */
final readonly class AgentNotices implements AgentNoticesContract
{
    public const string TRUSTED_ENTRY = 'agent notice';

    public function __construct(private JournalCommands $journal) {}

    public function notify(string $agentId, string $text, string $key): bool
    {
        $session = AgentSession::findLiveOf($agentId);

        if ($session === null) {
            return false;
        }

        $this->journal->runAsJournal(
            CommandEntry::Application,
            self::TRUSTED_ENTRY,
            DeliverAgentCommand::text($agentId, $session->id, $key, $text),
        );

        return true;
    }
}
