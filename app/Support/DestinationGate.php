<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Navigation\DeclaredPages;
use App\Support\Cards\DockDestination;
use App\Support\Sources\Contracts\CardContext as CardContextContract;
use App\Support\Sources\Contracts\DestinationGate as DestinationGateContract;

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
