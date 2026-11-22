<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actor;
use App\Contracts\ActorInboxResolver;
use App\Contracts\Inbox;
use App\Exceptions\InboxUnavailable;
use App\Models\DeskRecord;

/**
 * An actor's preferred inbox is the inbox of the desk it prefers.
 */
final readonly class PreferredDeskInboxes implements ActorInboxResolver
{
    public function preferredFor(Actor $actor): Inbox
    {
        $preferred = DeskRecord::preferredBy(ActorIdentity::of($actor));

        return $preferred->getOrThrow(InboxUnavailable::forActor($actor->actorId()));
    }
}
