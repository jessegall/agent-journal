<?php

declare(strict_types=1);

namespace Tests\Fixtures\Communication;

use App\Actors\Contracts\Actor;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxAccess;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Support\InboxMembers;
use App\Communication\Support\InboxMembership;

/**
 * The team inbox's access: nobody is a member, which is all the registration tests need.
 */
final readonly class TeamInboxAccess implements InboxAccess
{
    public function lockShared(Inbox $inbox): void {}

    public function lockExclusive(Inbox $inbox): void {}

    public function membership(Inbox $inbox, Actor $actor): InboxMembership
    {
        throw InboxUnavailable::forId($inbox->inboxId());
    }

    public function members(Inbox $inbox): InboxMembers
    {
        return new InboxMembers([]);
    }
}
