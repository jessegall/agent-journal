<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use Domain\Chat\Data\ChatRowsInput;
use Domain\Chat\Data\ChatRowsPageData;
use Domain\Chat\Resolvers\Support\ChatConversations;
use Domain\Chat\Support\AuthorizedConversations;

final readonly class ChatRowsController
{
    /**
     * A page of a chat's rows for a member, the newest or the one before an older cursor, so the window fills a gap
     * or pages back without reading the whole window again.
     */
    public function __invoke(
        ChatRowsInput $input,
        AuthorizedConversations $conversations,
        ChatConversations $chats,
    ): ChatRowsPageData {
        $conversations->inInbox($input->inboxId);

        return $chats->rowsPage($input->inboxId, $input->olderCursor);
    }
}
