<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Actors\Contracts\Actor;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Support\InboxMembers;
use App\Communication\Support\InboxMembership;

/**
 * Who may use an inbox and the locks that keep membership still while a message is sent or read; lifecycle locks
 * come before either guard.
 */
interface InboxAccess
{
    public function lockShared(Inbox $inbox): void;

    public function lockExclusive(Inbox $inbox): void;

    /**
     * @throws InboxUnavailable
     */
    public function membership(Inbox $inbox, Actor $actor): InboxMembership;

    public function members(Inbox $inbox): InboxMembers;
}
