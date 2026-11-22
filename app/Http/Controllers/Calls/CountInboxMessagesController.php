<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\CountInboxMessagesCall;
use App\Contracts\ConversationResolver;
use App\Data\InboxCounts;

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
