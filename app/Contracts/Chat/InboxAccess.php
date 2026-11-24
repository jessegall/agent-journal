<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Actors\Actor;
use App\Exceptions\InboxUnavailable;
use App\Support\ActorIdentity;
use App\Support\InboxMembers;
use App\Support\InboxMembership;
use Illuminate\Database\Eloquent\Builder;

/**
 * Who may use an inbox and the locks that keep membership still while a message is sent or read; lifecycle locks
 * come before either guard.
 */
interface InboxAccess
{
    /**
     * Locks the inbox against a change to who sits in it while a message is sent, until the transaction ends.
     */
    public function lockShared(Inbox $inbox): void;

    /**
     * Locks the inbox for a change to who sits in it, until the transaction ends.
     */
    public function lockExclusive(Inbox $inbox): void;

    /**
     * @throws InboxUnavailable
     */
    public function membership(Inbox $inbox, Actor $actor): InboxMembership;

    /**
     * The actors who read and answer the inbox's messages now.
     */
    public function members(Inbox $inbox): InboxMembers;

    /**
     * The ids of this provider's inboxes the actor is seated at now, as a query to read them by.
     *
     * @return Builder<*>
     */
    public function memberInboxIds(ActorIdentity $actor): Builder;
}
