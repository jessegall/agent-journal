<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Contracts\ActorResolver;
use App\Actors\Contracts\SeatedActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Support\AssigneeIdentity;
use App\Communication\Contracts\ActorInboxResolver;
use App\Desks\Contracts\DestinationProvider;
use App\Desks\Contracts\Destinations;

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
