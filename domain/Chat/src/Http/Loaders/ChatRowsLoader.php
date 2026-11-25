<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Loaders;

use Domain\Chat\Data\ChatRowsInput;
use Domain\Chat\Data\ChatRowsPageData;
use Domain\Chat\Resolvers\Support\ChatPages;
use Domain\Chat\Support\PairChats;

/**
 * The page of a chat's entries before the one named, for a window scrolled up, or the newest page; only for a chat the
 * viewer is attached to.
 */
final readonly class ChatRowsLoader
{
    public function __construct(private PairChats $chats, private ChatPages $pages) {}

    public function __invoke(ChatRowsInput $input): ChatRowsPageData
    {
        $this->chats->attached($input->inboxId);

        return $this->pages->entriesBefore($input->inboxId, $input->beforeId);
    }
}
