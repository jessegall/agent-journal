<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Exceptions\InboxUnavailable;
use App\Support\ActorIdentity;
use App\Support\ChatInterval;
use App\Support\InboxMembers;
use Illuminate\Database\Eloquent\Builder;

/**
 * Core's side of a chat inbox for the domain that provides it: making the inbox row, locking it while membership must
 * stay still, and reading its active intervals as plain data.
 */
interface ChatInboxStore
{
    public const string PROVIDER_KEY = 'chat';

    /**
     * Makes the chat inbox row under the provider's own id for it, and answers the new inbox id.
     */
    public function open(string $providerId): string;

    /**
     * Locks the inbox row for reading, so its membership stays still until the transaction ends.
     *
     * @throws InboxUnavailable
     */
    public function lockShared(Inbox $inbox): void;

    /**
     * Locks the inbox row for a change of its membership.
     *
     * @throws InboxUnavailable
     */
    public function lockExclusive(Inbox $inbox): void;

    /**
     * The actor's active interval in the inbox; an actor who is not a member now is refused as a missing inbox.
     *
     * @throws InboxUnavailable
     */
    public function activeInterval(Inbox $inbox, ActorIdentity $actor): ChatInterval;

    /**
     * Whether the actor holds an active interval in the inbox now.
     */
    public function isActiveMember(Inbox $inbox, ActorIdentity $actor): bool;

    /**
     * The inbox's active intervals in the order their members joined, at most the given number.
     *
     * @return list<ChatInterval>
     */
    public function activeIntervals(Inbox $inbox, int $limit = InboxMembers::LIMIT): array;

    /**
     * The ids of the chat inboxes the actor is an active member of, as a query to read them by.
     *
     * @return Builder<*>
     */
    public function memberInboxIds(ActorIdentity $actor): Builder;
}
