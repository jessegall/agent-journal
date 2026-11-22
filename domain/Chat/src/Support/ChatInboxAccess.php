<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxAccess;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Support\ChatInboxes;
use App\Communication\Support\ChatInterval;
use App\Communication\Support\InboxMembers;
use App\Communication\Support\InboxMembership;
use Domain\Chat\Models\Conversation;
use Illuminate\Database\Eloquent\Builder;

/**
 * Who may use a chat's inbox: the actors with an active interval in it, each proven by that interval. The inbox row
 * is the lock that keeps membership still while a message is sent or read, and a closed chat takes neither.
 */
final readonly class ChatInboxAccess implements InboxAccess
{
    public function __construct(private ChatInboxes $chats) {}

    public function lockShared(Inbox $inbox): void
    {
        $this->chats->lockShared($inbox);
        $this->assertOpen($inbox);
    }

    public function lockExclusive(Inbox $inbox): void
    {
        $this->chats->lockExclusive($inbox);
        $this->assertOpen($inbox);
    }

    /**
     * @throws InboxUnavailable
     */
    public function membership(Inbox $inbox, Actor $actor): InboxMembership
    {
        $interval = $this->chats->activeInterval($inbox, ActorIdentity::of($actor));

        return InboxMembership::inInterval($interval->actor, $interval->intervalId);
    }

    public function members(Inbox $inbox): InboxMembers
    {
        return new InboxMembers(array_map(
            fn (ChatInterval $interval) => InboxMembership::inInterval($interval->actor, $interval->intervalId),
            $this->chats->activeIntervals($inbox, InboxMembers::LIMIT),
        ));
    }

    public function memberInboxIds(ActorIdentity $actor): Builder
    {
        return $this->chats->memberInboxIds($actor);
    }

    /**
     * @throws InboxUnavailable
     */
    private function assertOpen(Inbox $inbox): void
    {
        $conversation = Conversation::query()
            ->where('inbox_id', $inbox->inboxId())
            ->firstOr(fn () => throw InboxUnavailable::forId($inbox->inboxId()));

        if (! $conversation->isOpen()) {
            throw InboxUnavailable::forId($inbox->inboxId());
        }
    }
}
