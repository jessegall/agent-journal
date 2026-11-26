<?php

declare(strict_types=1);

namespace Domain\Chat\Contracts\Docking;

use App\Values\ProjectOwner;
use Domain\Chat\Exceptions\DockSourceUnavailable;
use Domain\Chat\Support\Cards\ComposedCard;
use Domain\Chat\Values\DockDefinition;

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
     * The project the source belongs to, or Global, which its placement in a dock carries.
     *
     * @throws DockSourceUnavailable
     */
    public function ownerOf(DockDefinition $definition, string $id): ProjectOwner;

    /**
     * The card of each source the viewer may read; one it may not read has none.
     *
     * @param  list<string>  $ids
     * @return list<ComposedCard>
     */
    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array;
}
