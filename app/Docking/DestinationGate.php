<?php

declare(strict_types=1);

namespace App\Docking;

use App\Actors\Contracts\Actor;
use App\Docking\Cards\DockDestination;
use App\Docking\Sources\Contracts\CardContext as CardContextContract;
use App\Docking\Sources\Contracts\DestinationGate as DestinationGateContract;
use App\Navigation\Contracts\DeclaredPages;

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
