<?php

declare(strict_types=1);

namespace App\Docking\Sources\Contracts;

use App\Docking\Cards\ComposedCard;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\DockDefinition;

/**
 * Reads the sources of one dockable type for the current actor: one source to dock, refused alike when it is missing
 * or unreadable, and the cards of a batch of docked ones.
 */
interface DockableProvider
{
    /**
     * @throws DockSourceUnavailable
     */
    public function requireReadable(DockDefinition $definition, string $id): Dockable;

    /**
     * The card of each source the viewer may read; one it may not read has none.
     *
     * @param  list<string>  $ids
     * @return list<ComposedCard>
     */
    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array;
}
