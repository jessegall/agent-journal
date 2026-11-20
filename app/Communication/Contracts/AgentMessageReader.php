<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Communication\Data\AgentInbox;
use App\Communication\Data\AgentInboxCounts;
use App\Communication\Data\AgentMessageDetails;
use App\Communication\Enums\AgentInboxState;
use App\Communication\Enums\AgentMessageView;

/** Reads the caller's inbox and message context without changing any message or selection. */
interface AgentMessageReader
{
    public function inbox(AgentInboxState $state, int $page): AgentInbox;

    public function counts(): AgentInboxCounts;

    public function message(string $messageId, AgentMessageView $view): AgentMessageDetails;

    public function context(string $messageId, string|null $continuation): AgentMessageDetails;
}
