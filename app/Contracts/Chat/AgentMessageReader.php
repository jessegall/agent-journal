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

    public function inbox(AgentInboxState $state, int $page): AgentInbox;

    public function counts(): AgentInboxCounts;

    public function message(string $messageId, ReadView $view): AgentMessageDetails;

    public function context(string $messageId, string|null $continuation): AgentMessageDetails;
}
