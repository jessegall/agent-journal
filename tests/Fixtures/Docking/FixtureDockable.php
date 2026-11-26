<?php

declare(strict_types=1);

namespace Tests\Fixtures\Docking;

use App\Docking\Sources\Contracts\CardContext;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\Cards\Stack;
use App\Support\Cards\Title;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;

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
