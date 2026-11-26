<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Wire;

use App\Navigation\Contracts\DeclaredPages;
use Domain\Chat\Support\Cards\DockDestination;
use Domain\Chat\Support\Cards\DockLink;

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
