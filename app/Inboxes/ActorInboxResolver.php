<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorInboxResolver as ActorInboxResolverContract;
use App\Inboxes\Contracts\LabeledInbox;
use App\Models\Inboxes\Inbox;
use App\Support\ActorReference;

/**
 * An actor's own inbox is its personal inbox.
 */
final readonly class ActorInboxResolver implements ActorInboxResolverContract
{
    public function preferredFor(Actor $actor): LabeledInbox
    {
        return Inbox::findPersonalOf(ActorReference::of($actor));
    }
}
