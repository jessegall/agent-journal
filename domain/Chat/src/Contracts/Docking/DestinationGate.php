<?php

declare(strict_types=1);

namespace Domain\Chat\Contracts\Docking;

use App\Actors\Contracts\Actor;
use Domain\Chat\Support\Cards\DockDestination;

/**
 * Says whether a viewer may open a declared page with these arguments, so a card offers only the pages it may.
 */
interface DestinationGate
{
    /**
     * Whether the viewer may see cards placed at the destination.
     */
    public function permits(Actor $viewer, DockDestination $destination): bool;

    /**
     * The context a viewer's cards are composed in, offering the pages this gate permits.
     */
    public function contextFor(Actor $viewer): CardContext;
}
