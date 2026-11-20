<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Communication\Contracts\ConversationResolver;
use App\Communication\Exceptions\InboxUnavailable;
use App\Records\Contracts\RecordResolver;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;

/**
 * Which records the asker may dock: one it can read now, in a conversation one of whose inboxes it sits at.
 */
final readonly class DockableRecords
{
    public function __construct(
        private ConversationResolver $messages,
        private RecordResolver $records,
    ) {}

    /**
     * @throws InboxUnavailable
     * @throws RecordUnavailable
     */
    public function requireIn(ConversationPair $conversation, RecordIdentity $record): void
    {
        $hasSeatInConversation = $this->messages->sitsAt($conversation->sourceInboxId)
            || $this->messages->sitsAt($conversation->destinationInboxId);

        if (! $hasSeatInConversation) {
            throw InboxUnavailable::forId($conversation->sourceInboxId);
        }

        $this->records->requireReadable($record);
    }
}
