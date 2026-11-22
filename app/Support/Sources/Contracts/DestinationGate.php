<?php

declare(strict_types=1);

namespace App\Support\Sources\Contracts;

use App\Contracts\Actors\Actor;
use App\Support\Cards\DockDestination;

/**
 * Says whether a viewer may open a declared page with these arguments, so a card offers only the pages it may.
 */
interface DestinationGate
{
    public function permits(Actor $viewer, DockDestination $destination): bool;

    /**
     * The context a viewer's cards are composed in, offering the pages this gate permits.
     */
    public function contextFor(Actor $viewer): CardContext;
}
