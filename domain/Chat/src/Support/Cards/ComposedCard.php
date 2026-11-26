<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

/**
 * One source's card, as its owner composed it for a viewer.
 */
final readonly class ComposedCard
{
    public function __construct(public DockIdentity $source, public DockCard $card) {}
}
