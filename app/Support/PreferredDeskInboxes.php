<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorInboxResolver;
use App\Contracts\Chat\Inbox;
use App\Exceptions\InboxUnavailable;
use App\Models\Desks\DeskRecord;

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
