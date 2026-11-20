<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\InboxView;
use App\Communication\Data\MessagePage;
use App\Ui\Contracts\PageResolver;
use Domain\Chat\Data\InboxPageData;
use Domain\Chat\Data\InboxPanelData;

/**
 * Reads the Inbox page: each inbox the user sits at with its counts and newest page. Reading marks nothing read.
 */
final readonly class InboxPageResolver implements PageResolver
{
    public function __construct(private ConversationResolver $messages) {}

    public function read(): InboxPageData
    {
        return InboxPageData::from(['panels' => array_map(
            fn (InboxView $inbox) => InboxPanelData::from([
                'inbox' => $inbox,
                'page' => $this->messages->history($inbox->inboxId, null, MessagePage::DEFAULT_LIMIT),
            ]),
            $this->messages->ownInboxes(),
        )]);
    }
}
