<?php

declare(strict_types=1);

namespace App\Docking\Sources\Contracts;

use App\Docking\Cards\DockCard;
use App\Docking\Cards\DockIdentity;
use App\Docking\Sources\DockDefinition;

/**
 * A durable source a conversation can dock: it names itself under its registered definition and is the one author
 * of its card.
 */
interface Dockable
{
    public function identifyFor(DockDefinition $definition): DockIdentity;

    public function composeDockCard(CardContext $context): DockCard;
}
