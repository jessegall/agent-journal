<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorInboxResolver;
use App\Contracts\Assignments\Assignee;
use App\Contracts\Inboxes\LabeledInbox;
use App\Contracts\Records\Destinations;

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
