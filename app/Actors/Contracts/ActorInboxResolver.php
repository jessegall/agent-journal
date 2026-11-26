<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Exceptions\InboxUnavailable;
use App\Inboxes\Contracts\LabeledInbox;

/**
 * The inbox an actor prefers to receive messages at.
 */
interface ActorInboxResolver
{
    /**
     * @throws InboxUnavailable
     */
    public function preferredFor(Actor $actor): LabeledInbox;
}
