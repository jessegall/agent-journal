<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\CurrentActor;
use App\Exceptions\MessageMissing;
use App\Messages\Data\MessageView;
use App\Messages\ShownMessage;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;

/**
 * A message the current actor may pin: one stored in the inbox named, which the actor is attached to.
 */
final readonly class PinnableMessages
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @throws MessageMissing
     */
    public function requireIn(string $inboxId, string $messageId): MessageView
    {
        $message = Message::query()->inInbox($inboxId)->whereKey($messageId)->first();

        if ($message === null || ! InboxMember::isAttached($inboxId, $this->actors->actor())) {
            throw MessageMissing::forId($messageId);
        }

        return MessageView::from(ShownMessage::of($message));
    }
}
