<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Docking;

use App\Data\Pages\RecordCard;
use Domain\Chat\Contracts\Docking\CardContext;
use Domain\Chat\Contracts\Docking\Dockable;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\DockDestination;
use Domain\Chat\Support\Cards\DockIdentity;
use Domain\Chat\Support\Cards\Stack;
use Domain\Chat\Support\Cards\Subtitle;
use Domain\Chat\Support\Cards\Title;
use Domain\Chat\Values\DockDefinition;

/**
 * A record whose owner composes no card of its own, docked as its link card shows it: its title, its abstract when it
 * has one, and Open only when its page is a declared page the viewer may open.
 */
final readonly class LinkCardDockable implements Dockable
{
    public function __construct(private RecordCard $record, private DockDestination|null $page) {}

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->record->id);
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        $title = new Title('title', $this->record->title);

        $root = $this->record->abstract === null
            ? Stack::root($title)
            : Stack::root($title, new Subtitle('abstract', $this->record->abstract));

        $open = $this->page === null ? null : $context->permittedDestination($this->page)->getOrElse(null);

        return DockCard::named($this->record->title, $root, $open);
    }
}
