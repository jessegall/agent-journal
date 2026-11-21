<?php

declare(strict_types=1);

namespace Tests\Fixtures\Docking;

use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Cards\Stack;
use App\Docking\Cards\Title;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Cards\DockCard;
use App\Docking\Sources\DockDefinition;
use App\Docking\Cards\DockIdentity;

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
