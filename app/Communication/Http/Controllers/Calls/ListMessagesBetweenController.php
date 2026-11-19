<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Communication\Calls\ListMessagesBetweenCall;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\MessagePage;

/**
 * Reads the messages between two inboxes, both ways, older than the cursor.
 */
final readonly class ListMessagesBetweenController
{
    public function __invoke(ListMessagesBetweenCall $call, ConversationResolver $conversations): MessagePage
    {
        $page = $call->page;

        return $conversations->between($call->firstInboxId, $call->secondInboxId, $page->olderCursor, $page->limit);
    }
}
