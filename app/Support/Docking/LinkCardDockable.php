<?php

declare(strict_types=1);

namespace App\Support\Docking;

use App\Data\Pages\RecordCard;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockDestination;
use App\Support\Cards\DockIdentity;
use App\Support\Cards\Stack;
use App\Support\Cards\Subtitle;
use App\Support\Cards\Title;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;

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
            ? Stack::of('root', $title)
            : Stack::of('root', $title, new Subtitle('abstract', $this->record->abstract));

        $open = $this->page === null ? null : $context->permittedDestination($this->page)->getOrElse(null);

        return DockCard::named($this->record->title, $root, $open);
    }
}
