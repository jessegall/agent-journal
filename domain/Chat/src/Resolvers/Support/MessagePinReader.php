<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers\Support;

use App\Actors\Contracts\CurrentActor;
use App\Exceptions\MessageMissing;
use App\Messages\Data\MessageView;
use App\Messages\ShownMessage;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use Domain\Chat\Models\MessagePin;

/**
 * The asker's pins, newest first, as the messages they point at; a pin whose message the asker can no longer read is
 * left out but kept, so it comes back with access.
 */
final readonly class MessagePinReader
{
    public function __construct(
        private CurrentActor $actors,
    ) {}

    /**
     * @return list<MessageView>
     */
    public function pinned(int $limit = MessagePin::DEFAULT_LIMIT): array
    {
        $pins = MessagePin::query()
            ->ownedBy($this->actors->actor())
            ->newestPinnedFirst()
            ->limit(max(1, min($limit, MessagePin::LARGEST_LIMIT)))
            ->get();

        $views = [];

        foreach ($pins as $pin) {
            try {
                $views[] = $this->requireIn($pin->inbox_id, $pin->message_id);
            } catch (MessageMissing) {
                continue;
            }
        }

        return $views;
    }

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
