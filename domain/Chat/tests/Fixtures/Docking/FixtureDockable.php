<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Fixtures\Docking;

use Domain\Chat\Contracts\Docking\CardContext;
use Domain\Chat\Contracts\Docking\Dockable;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\DockIdentity;
use Domain\Chat\Support\Cards\Stack;
use Domain\Chat\Support\Cards\Title;
use Domain\Chat\Values\DockDefinition;

/**
 * A source an owner composes its own card for, standing in for a rich owner in the registry's tests.
 */
final readonly class FixtureDockable implements Dockable
{
    public function __construct(private string $id) {}

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->id);
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        return DockCard::named("Fixture {$this->id}", Stack::of('root', new Title('title', "Fixture {$this->id}")));
    }
}
