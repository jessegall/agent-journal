<?php

declare(strict_types=1);

namespace App\Docking\Support;

use App\Actors\Contracts\Actor;
use App\Docking\Cards\DockDestination;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\DestinationGate;
use App\Ui\Contracts\DeclaredPages;

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
