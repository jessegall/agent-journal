<?php

declare(strict_types=1);

namespace Tests\Fixtures\Docking;

use App\Actors\Contracts\Actor;
use App\Docking\CardContext;
use App\Docking\Cards\DockDestination;
use App\Docking\Sources\Contracts\CardContext as CardContextContract;
use App\Docking\Sources\Contracts\DestinationGate;

/**
 * A gate that lets every viewer open every page, for tests that are not about access.
 */
final readonly class OpenGate implements DestinationGate
{
    public function permits(Actor $viewer, DockDestination $destination): bool
    {
        return true;
    }

    public function contextFor(Actor $viewer): CardContextContract
    {
        return new CardContext($viewer, $this);
    }
}
