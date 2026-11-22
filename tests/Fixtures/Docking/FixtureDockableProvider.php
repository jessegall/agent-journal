<?php

declare(strict_types=1);

namespace Tests\Fixtures\Docking;

use App\Support\Cards\ComposedCard;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\DockDefinition;

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
