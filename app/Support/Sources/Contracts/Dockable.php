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
    /**
     * The identity a docked card of the record is kept under.
     */
    public function identifyFor(DockDefinition $definition): DockIdentity;

    /**
     * The card the record shows when docked, in the context.
     */
    public function composeDockCard(CardContext $context): DockCard;
}
