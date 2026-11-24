<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use Domain\Chat\Data\ChatRowsInput;
use Domain\Chat\Data\ChatRowsPageData;
use Domain\Chat\Resolvers\Support\ChatPages;
use Domain\Chat\Support\ChatInboxes;

/**
 * The page of a chat's entries before the one named, for a window scrolled up, or the newest page; only for a chat the
 * viewer is attached to.
 */
final readonly class ChatRowsController
{
    public function __invoke(ChatRowsInput $input, ChatInboxes $chats, ChatPages $pages): ChatRowsPageData
    {
        $chats->attached($input->inboxId);

        return $pages->entriesBefore($input->inboxId, $input->beforeId);
    }
}
