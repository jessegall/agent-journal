<?php

declare(strict_types=1);

namespace Tests\Fixtures\Docking;

use App\Actors\Contracts\Actor;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\DestinationGate;
use App\Docking\Support\GatedCardContext;
use App\Docking\Cards\DockDestination;

/**
 * A gate that lets every viewer open every page, for tests that are not about access.
 */
final readonly class OpenGate implements DestinationGate
{
    public function permits(Actor $viewer, DockDestination $destination): bool
    {
        return true;
    }

    public function contextFor(Actor $viewer): CardContext
    {
        return new GatedCardContext($viewer, $this);
    }
}
