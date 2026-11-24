<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorInboxResolver;
use App\Contracts\Actors\ActorResolver;
use App\Contracts\Assignments\AssignmentProviders;
use App\Contracts\Records\DestinationProvider;
use App\Contracts\Records\Destinations;
use App\Enums\ActorType;
use App\Models\Inboxes\Inbox;

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
        $identity = new ActorIdentity(ActorType::from($requested->type), $requested->id);
        $forwarding = Inbox::query()->forwarding()->attachedTo($identity)->orderBy('id')->first();

        if ($forwarding !== null) {
            return new ResolvedDestinations($forwarding, $forwarding);
        }

        return new DirectDestinations($assignee, $this->actors->get($identity), $this->inboxes);
    }
}
