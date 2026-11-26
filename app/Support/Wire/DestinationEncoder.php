<?php

declare(strict_types=1);

namespace App\Support\Wire;

use App\Docking\Cards\DockDestination;
use App\Docking\Cards\DockLink;
use App\Navigation\Contracts\DeclaredPages;

/**
 * Writes a page a card opens as the link the browser follows.
 */
final readonly class DestinationEncoder
{
    public function __construct(private DeclaredPages $pages) {}

    public function encode(DockDestination $destination): DockLink
    {
        return $destination->linkIn($this->pages);
    }
}
