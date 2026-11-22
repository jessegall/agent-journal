<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxProvider;
use App\Exceptions\InboxUnavailable;
use App\Support\ActorIdentity;
use Domain\Chat\Models\Conversation;

/**
 * Chats as inboxes: the inbox of a chat is found by the provider id its conversation was opened under, and labelled
 * by the chat's title, or for a direct chat by the name of the other side.
 */
final readonly class ChatInboxProvider implements InboxProvider
{
    private const string UNTITLED = 'Chat';

    public function __construct(private CurrentActor $actors, private ActorLabels $labels) {}

    public function inboxFor(string $inboxId, string $providerId): Inbox
    {
        $conversation = Conversation::query()
            ->where('provider_id', $providerId)
            ->with('directChat')
            ->firstOr(fn () => throw InboxUnavailable::forId($inboxId));

        return new ChatInbox($inboxId, $this->labelOf($conversation));
    }

    private function labelOf(Conversation $conversation): string
    {
        if ($conversation->title !== null) {
            return $conversation->title;
        }

        $direct = $conversation->directChat;

        if ($direct === null) {
            return self::UNTITLED;
        }

        $peer = $direct->otherSide(ActorIdentity::of($this->actors->actor()));

        return $this->labels->labelsFor([$peer])->nameOf($peer) ?? self::UNTITLED;
    }
}
