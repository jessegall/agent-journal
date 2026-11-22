<?php

declare(strict_types=1);

namespace App\Support\Wire;

use App\Contracts\DeclaredPages;
use App\Support\Cards\DockDestination;
use App\Support\Cards\DockLink;

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
