<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorInboxResolver;
use App\Contracts\Actors\ActorResolver;
use App\Contracts\Assignments\AssignmentProviders;
use App\Contracts\Chat\SeatedActor;
use App\Contracts\Records\DestinationProvider;
use App\Contracts\Records\Destinations;
use App\Enums\ActorType;

/**
 * An actor's destinations: the desk of its forwarding seat when it forwards and holds one, otherwise the actor itself
 * with its preferred inbox. Forwarding is a capability of the actor, never a check of its type or role.
 */
final readonly class ActorDestinationProvider implements DestinationProvider
{
    public function __construct(
        private AssignmentProviders $providers,
        private ActorResolver $actors,
        private OccupiedForwardingSeats $seats,
        private ActorInboxResolver $inboxes,
    ) {}

    public function destinationsFor(AssigneeIdentity $requested): Destinations
    {
        $assignee = $this->providers->assigneeProvider($requested->type)->requireEligible($requested);
        $actor = $this->actors->get(new ActorIdentity(ActorType::from($requested->type), $requested->id));

        if ($actor instanceof SeatedActor) {
            $seat = $this->seats->forActor($actor);

            if ($seat->isDefined()) {
                $desk = $seat->get()->desk;

                return new ResolvedDestinations($desk, $desk);
            }
        }

        return new DirectDestinations($assignee, $actor, $this->inboxes);
    }
}
