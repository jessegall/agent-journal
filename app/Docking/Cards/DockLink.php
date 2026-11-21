<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use JsonSerializable;

/**
 * A page a card opens as the browser follows it: the declared page's key and the address it is served at.
 */
final readonly class DockLink implements JsonSerializable
{
    public function __construct(public string $page, public string $href) {}

    public function jsonSerialize(): mixed
    {
        return ['page' => $this->page, 'href' => $this->href];
    }
}
