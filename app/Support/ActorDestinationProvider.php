<?php

declare(strict_types=1);

namespace App\Support;

use App\Actors\Contracts\ActorInboxResolver;
use App\Actors\Contracts\ActorResolver;
use App\Assignments\Contracts\AssignmentProviders;
use App\Models\Inboxes\Inbox;
use App\Records\Contracts\DestinationProvider;
use App\Records\Contracts\Destinations;

/**
 * An actor's destinations: the forwarding inbox it is attached to when there is one, otherwise the actor itself with
 * its own inbox.
 */
final readonly class ActorDestinationProvider implements DestinationProvider
{
    public function __construct(
        private AssignmentProviders $providers,
        private ActorResolver $actors,
        private ActorInboxResolver $inboxes,
    ) {}

    public function destinationsFor(AssigneeIdentity $requested): Destinations
    {
        $assignee = $this->providers->assigneeProvider($requested->type)->requireEligible($requested);
        $identity = ActorReference::fromStored($requested->type, $requested->id);
        $forwarding = Inbox::query()->forwarding()->attachedTo($identity)->oldestFirst()->first();

        if ($forwarding !== null) {
            return new ResolvedDestinations($forwarding, $forwarding);
        }

        return new DirectDestinations($assignee, $this->actors->get($identity), $this->inboxes);
    }
}
