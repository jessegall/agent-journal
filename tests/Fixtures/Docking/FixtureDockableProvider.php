<?php

declare(strict_types=1);

namespace Tests\Fixtures\Docking;

use App\Docking\Cards\ComposedCard;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\DockDefinition;

/**
 * Reads fixture sources: every id exists and every viewer may read it.
 */
final readonly class FixtureDockableProvider implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return new FixtureDockable($id);
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
