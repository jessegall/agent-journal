<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Data\AgentInbox;
use App\Data\AgentInboxCounts;
use App\Data\AgentMessageDetails;
use App\Enums\AgentInboxState;
use App\Enums\ReadView;
use App\Mcp\Data\SearchPage;

/**
 * Reads the caller's inbox and message context without changing any message or selection.
 */
interface AgentMessageReader
{
    public const string CONTEXT_TOOL = 'messages_context';

    public const string SEARCH_TYPE = 'chat.message';

    public function inbox(AgentInboxState $state, int $page): AgentInbox;

    public function counts(): AgentInboxCounts;

    public function search(string $query, int $page): SearchPage;

    public function message(string $messageId, ReadView $view): AgentMessageDetails;

    public function context(string $messageId, string|null $continuation): AgentMessageDetails;
}
