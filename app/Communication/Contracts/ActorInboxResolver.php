<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Actors\Contracts\Actor;
use App\Communication\Exceptions\InboxUnavailable;

/**
 * The inbox an actor prefers to receive messages at.
 */
interface ActorInboxResolver
{
    /**
     * @throws InboxUnavailable
     */
    public function preferredFor(Actor $actor): Inbox;
}
