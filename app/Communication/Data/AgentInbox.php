<?php

declare(strict_types=1);

namespace App\Communication\Data;

use App\Assignments\Support\NumberedPage;

/**
 * One numbered page of messages addressed to the caller's inboxes.
 */
final readonly class AgentInbox
{
    /**
     * @param list<AgentMessageCard> $messages
     */
    public function __construct(public array $messages, public NumberedPage $page, public int $total) {}
}
