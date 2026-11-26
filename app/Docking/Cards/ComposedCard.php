<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;

/**
 * One source's card, as its owner composed it for a viewer.
 */
final readonly class ComposedCard
{
    public function __construct(public DockIdentity $source, public DockCard $card) {}
}
