<?php

declare(strict_types=1);

namespace App\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorInboxResolver;
use App\Assignments\Contracts\Assignee;
use App\Inboxes\Contracts\LabeledInbox;
use App\Records\Contracts\Destinations;

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

    public function inbox(): LabeledInbox
    {
        return $this->inboxes->preferredFor($this->actor);
    }
}
