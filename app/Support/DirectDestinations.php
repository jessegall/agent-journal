<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actor;
use App\Contracts\ActorInboxResolver;
use App\Contracts\Assignee;
use App\Contracts\Destinations;
use App\Contracts\Inbox;

/**
 * An actor's own destinations: work goes to the actor, and messages to its preferred inbox, read only when a
 * message asks for it.
 */
final readonly class DirectDestinations implements Destinations
{
    public function __construct(
        private Assignee $holder,
        private Actor $actor,
        private ActorInboxResolver $inboxes,
    ) {}

    public function assignee(): Assignee
    {
        return $this->holder;
    }

    public function inbox(): Inbox
    {
        return $this->inboxes->preferredFor($this->actor);
    }
}
