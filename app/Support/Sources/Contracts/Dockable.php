<?php

declare(strict_types=1);

namespace App\Support\Sources\Contracts;

use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\Sources\DockDefinition;

/**
 * A durable source a conversation can dock: it names itself under its registered definition and is the one author
 * of its card.
 */
interface Dockable
{
    public function identifyFor(DockDefinition $definition): DockIdentity;

    public function composeDockCard(CardContext $context): DockCard;
}
