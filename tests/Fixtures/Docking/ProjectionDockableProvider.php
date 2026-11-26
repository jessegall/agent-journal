<?php

declare(strict_types=1);

namespace Tests\Fixtures\Docking;

use App\Docking\Cards\ComposedCard;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
use App\Values\ProjectOwner;

/**
 * Reads projection fixtures: a source whose id starts with hidden- is one the viewer may not read.
 */
final readonly class ProjectionDockableProvider implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return new ProjectionDockable($id);
    }

    public function ownerOf(DockDefinition $definition, string $id): ProjectOwner
    {
        return ProjectOwner::global();
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $cards = [];

        foreach ($ids as $id) {
            if (str_starts_with($id, 'hidden-')) {
                continue;
            }

            $source = new ProjectionDockable($id);
            $cards[] = new ComposedCard($source->identifyFor($definition), $source->composeDockCard($context));
        }

        return $cards;
    }
}
