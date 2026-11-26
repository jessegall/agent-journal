<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Fixtures\Docking;

use App\Values\ProjectOwner;
use Domain\Chat\Contracts\Docking\CardContext;
use Domain\Chat\Contracts\Docking\Dockable;
use Domain\Chat\Contracts\Docking\DockableProvider;
use Domain\Chat\Support\Cards\ComposedCard;
use Domain\Chat\Values\DockDefinition;

/**
 * Reads fixture sources: every id exists and every viewer may read it.
 */
final readonly class FixtureDockableProvider implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return new FixtureDockable($id);
    }

    public function ownerOf(DockDefinition $definition, string $id): ProjectOwner
    {
        return ProjectOwner::global();
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $cards = [];

        foreach ($ids as $id) {
            $source = new FixtureDockable($id);
            $cards[] = new ComposedCard($source->identifyFor($definition), $source->composeDockCard($context));
        }

        return $cards;
    }
}
