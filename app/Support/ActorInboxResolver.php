<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorInboxResolver as ActorInboxResolverContract;
use App\Contracts\Inboxes\LabeledInbox;
use App\Models\Inboxes\Inbox;

/**
 * An actor's own inbox is its personal inbox.
 */
final readonly class ActorInboxResolver implements ActorInboxResolverContract
{
    public function preferredFor(Actor $actor): LabeledInbox
    {
        return Inbox::personalOf(ActorIdentity::of($actor));
    }
}
