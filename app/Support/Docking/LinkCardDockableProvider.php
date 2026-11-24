<?php

declare(strict_types=1);

namespace App\Support\Docking;

use App\Contracts\Records\RecordResolver;
use App\Data\Pages\RecordCard;
use App\Exceptions\DockSourceUnavailable;
use App\Exceptions\RecordUnavailable;
use App\Support\Cards\ComposedCard;
use App\Support\RecordIdentity;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\DockDefinition;

/**
 * Reads records with no card of their own through their record provider: one the actor may read for docking, and the
 * visible ones of a batch, each docked as its link card.
 */
final readonly class LinkCardDockableProvider implements DockableProvider
{
    public function __construct(private RecordResolver $records, private DeclaredPageRoutes $pages) {}

    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        $identity = new RecordIdentity($definition->type, $id);

        try {
            $this->records->requireReadable($identity);

            return $this->dockableOf($this->records->card($identity));
        } catch (RecordUnavailable $unavailable) {
            throw DockSourceUnavailable::unreadable($definition->type, $id, $unavailable);
        }
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $identities = array_map(fn (string $id) => new RecordIdentity($definition->type, $id), $ids);

        $cards = [];

        foreach ($this->records->visibleCards($identities) as $record) {
            $dockable = $this->dockableOf($record);
            $cards[] = new ComposedCard($dockable->identifyFor($definition), $dockable->composeDockCard($context));
        }

        return $cards;
    }

    private function dockableOf(RecordCard $record): LinkCardDockable
    {
        return new LinkCardDockable($record, $this->pages->destinationOf($record->route)->getOrElse(null));
    }
}
