<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Contracts\Inboxes\LabeledInbox;
use App\Exceptions\InboxUnavailable;

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
