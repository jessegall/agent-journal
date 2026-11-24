<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Data\Messages\AgentInbox;
use App\Data\Messages\AgentInboxCounts;
use App\Data\Messages\AgentMessageDetails;
use App\Enums\AgentInboxState;
use App\Enums\ReadView;

/**
 * Reads the caller's inbox and message context without changing any message or selection.
 */
interface AgentMessageReader
{
    public const string CONTEXT_TOOL = 'messages_context';

    /**
     * One page of the agent's messages in the state.
     */
    public function inbox(AgentInboxState $state, int $page): AgentInbox;

    /**
     * How many messages the agent has unread, waiting and answered.
     */
    public function counts(): AgentInboxCounts;

    /**
     * One message as the view shows it.
     */
    public function message(string $messageId, ReadView $view): AgentMessageDetails;

    /**
     * A message with the conversation around it, read on from the continuation when one is given.
     */
    public function context(string $messageId, string|null $continuation): AgentMessageDetails;
}
