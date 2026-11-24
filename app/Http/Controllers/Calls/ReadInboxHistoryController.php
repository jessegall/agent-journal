<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\ReadInboxHistoryCall;
use App\Contracts\Chat\ConversationResolver;
use App\Data\Messages\MessagePage;

/**
 * Reads an inbox's whole history, incoming and outgoing, older than the cursor.
 */
final readonly class ReadInboxHistoryController
{
    public function __invoke(ReadInboxHistoryCall $call, ConversationResolver $conversations): MessagePage
    {
        return $conversations->history($call->inboxId, $call->page->olderCursor, $call->page->limit);
    }
}
