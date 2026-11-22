<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\Inbox;
use App\Exceptions\InboxUnavailable;
use App\Models\InboxInterval;
use App\Models\InboxRecord;
use Illuminate\Database\Eloquent\Builder;

/**
 * Core's side of a chat inbox for the domain that provides it: making the inbox row, locking it while membership must
 * stay still, and reading its active intervals as plain data.
 */
final readonly class ChatInboxes
{
    public const string PROVIDER_KEY = 'chat';

    /**
     * Makes the chat inbox row under the provider's own id for it, and answers the new inbox id.
     */
    public function open(string $providerId): string
    {
        return InboxRecord::create(self::PROVIDER_KEY, $providerId)->id;
    }

    /**
     * @throws InboxUnavailable
     */
    public function lockShared(Inbox $inbox): void
    {
        InboxRecord::query()->whereKey($inbox->inboxId())->sharedLock()->firstOr(
            fn () => throw InboxUnavailable::forId($inbox->inboxId()),
        );
    }

    /**
     * @throws InboxUnavailable
     */
    public function lockExclusive(Inbox $inbox): void
    {
        InboxRecord::query()->whereKey($inbox->inboxId())->lockForUpdate()->firstOr(
            fn () => throw InboxUnavailable::forId($inbox->inboxId()),
        );
    }

    /**
     * The actor's active interval in the inbox; an actor who is not a member now is refused as a missing inbox.
     *
     * @throws InboxUnavailable
     */
    public function activeInterval(Inbox $inbox, ActorIdentity $actor): ChatInterval
    {
        $interval = InboxInterval::query()
            ->activeFor($inbox->inboxId())
            ->heldBy($actor)
            ->firstOr(fn () => throw InboxUnavailable::forId($inbox->inboxId()));

        return $interval->chatInterval;
    }

    public function isActiveMember(Inbox $inbox, ActorIdentity $actor): bool
    {
        return InboxInterval::query()->activeFor($inbox->inboxId())->heldBy($actor)->exists();
    }

    /**
     * The inbox's active intervals in the order their members joined, at most the given number.
     *
     * @return list<ChatInterval>
     */
    public function activeIntervals(Inbox $inbox, int $limit = InboxMembers::LIMIT): array
    {
        return array_values(InboxInterval::query()
            ->activeFor($inbox->inboxId())
            ->orderBy('joined_sequence')
            ->orderBy('id')
            ->limit($limit)
            ->get()
            ->map(fn (InboxInterval $interval) => $interval->chatInterval)
            ->all());
    }

    /**
     * The ids of the chat inboxes the actor is an active member of, as a query to read them by.
     *
     * @return Builder<*>
     */
    public function memberInboxIds(ActorIdentity $actor): Builder
    {
        return InboxInterval::query()->whereNull('left_at')->heldBy($actor)->select('inbox_id');
    }
}
