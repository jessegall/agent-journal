<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Navigation\DeclaredPages;
use App\Support\Cards\DockDestination;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\DestinationGate;

/**
 * Lets a card open a page that some domain declared; the page checks the viewer's access again when it opens.
 */
final readonly class DeclaredPageGate implements DestinationGate
{
    public function __construct(private DeclaredPages $pages) {}

    public function permits(Actor $viewer, DockDestination $destination): bool
    {
        return $destination->isDeclaredIn($this->pages);
    }

    public function contextFor(Actor $viewer): CardContext
    {
        return new GatedCardContext($viewer, $this);
    }
}
