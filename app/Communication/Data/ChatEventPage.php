<?php

declare(strict_types=1);

namespace App\Communication\Data;

use App\Communication\Support\ChatInterval;

/**
 * What a chat member reads of its chat: after a cursor, the events since it up to the watermark; without one, a
 * snapshot of who is in the chat, its unread count and newest page. Once the member's access ended it says only that.
 */
final readonly class ChatEventPage
{
    /**
     * @param  list<ChatEventView>  $events
     * @param  list<ChatInterval>  $members
     */
    public function __construct(
        public string $inboxId,
        public bool $accessEnded,
        public array $events,
        public string|null $cursor,
        public int $watermark,
        public array $members,
        public int|null $unread,
        public MessagePage|null $latest,
    ) {}

    public static function accessEnded(string $inboxId): self
    {
        return new self($inboxId, true, [], null, 0, [], null, null);
    }
}
