<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Communication\Calls\CountInboxMessagesCall;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\InboxCounts;

/**
 * Counts an inbox's unread, unclaimed and claimed messages.
 */
final readonly class CountInboxMessagesController
{
    public function __invoke(CountInboxMessagesCall $call, ConversationResolver $conversations): InboxCounts
    {
        return $conversations->counts($call->inboxId);
    }
}
