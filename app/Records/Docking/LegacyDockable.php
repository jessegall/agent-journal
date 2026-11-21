<?php

declare(strict_types=1);

namespace App\Records\Docking;

use App\Docking\Cards\DockCard;
use App\Docking\Cards\DockDestination;
use App\Docking\Cards\DockIdentity;
use App\Docking\Cards\Stack;
use App\Docking\Cards\Subtitle;
use App\Docking\Cards\Title;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\DockDefinition;
use App\Records\Data\RecordCard;

/**
 * A record whose owner composes no card of its own, docked as its link card shows it: its title, its abstract when it
 * has one, and Open only when its page is a declared page the viewer may open.
 */
final readonly class LegacyDockable implements Dockable
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
