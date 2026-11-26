<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Docking;

use App\Actors\Contracts\Actor;
use App\Navigation\Contracts\DeclaredPages;
use Domain\Chat\Contracts\Docking\CardContext as CardContextContract;
use Domain\Chat\Contracts\Docking\DestinationGate as DestinationGateContract;
use Domain\Chat\Support\Cards\DockDestination;

/**
 * Lets a card open a page that some domain declared; the page checks the viewer's access again when it opens.
 */
final readonly class DestinationGate implements DestinationGateContract
{
    public function __construct(private DeclaredPages $pages) {}

    public function permits(Actor $viewer, DockDestination $destination): bool
    {
        return $destination->isDeclaredIn($this->pages);
    }

    public function contextFor(Actor $viewer): CardContextContract
    {
        return new CardContext($viewer, $this);
    }
}
