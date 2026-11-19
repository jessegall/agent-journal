<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\ActorInboxResolver;
use App\Communication\Contracts\Inbox;
use App\Communication\Exceptions\InboxUnavailable;
use App\Desks\Models\DeskRecord;

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
