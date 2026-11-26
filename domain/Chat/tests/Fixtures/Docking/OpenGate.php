<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Fixtures\Docking;

use App\Actors\Contracts\Actor;
use Domain\Chat\Contracts\Docking\CardContext as CardContextContract;
use Domain\Chat\Contracts\Docking\DestinationGate;
use Domain\Chat\Support\Cards\DockDestination;
use Domain\Chat\Support\Docking\CardContext;

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
