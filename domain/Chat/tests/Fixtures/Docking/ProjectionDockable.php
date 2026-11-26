<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Fixtures\Docking;

use Domain\Chat\Contracts\Docking\CardContext;
use Domain\Chat\Contracts\Docking\Dockable;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\DockIdentity;
use Domain\Chat\Support\Cards\Stack;
use Domain\Chat\Support\Cards\Subtitle;
use Domain\Chat\Support\Cards\Title;
use Domain\Chat\Values\DockDefinition;

/**
 * A source whose id says what its card is: a large one near the card's byte budget, one with a part that cannot be
 * written, or a small one.
 */
final readonly class ProjectionDockable implements Dockable
{
    public const int LARGE_TEXT_CHARACTERS = 30_000;

    public function __construct(private string $id) {}

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->id);
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        $title = new Title('title', "Fixture {$this->id}");

        return match (true) {
            str_starts_with($this->id, 'large-') => DockCard::named($this->id, Stack::of(
                'root',
                $title,
                new Subtitle('text', str_repeat('x', self::LARGE_TEXT_CHARACTERS)),
            )),
            str_starts_with($this->id, 'broken-') => DockCard::named($this->id, Stack::of('root', $title, new UnmappedPart())),
            default => DockCard::named($this->id, Stack::of('root', $title)),
        };
    }
}
