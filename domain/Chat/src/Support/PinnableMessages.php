<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\Actors\CurrentActor;
use App\Data\Messages\MessageView;
use App\Exceptions\MessageMissing;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;

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

        if ($message === null || ! InboxMember::isAttached($inboxId, ActorIdentity::of($this->actors->actor()))) {
            throw MessageMissing::forId($messageId);
        }

        return MessageView::of($message);
    }
}
