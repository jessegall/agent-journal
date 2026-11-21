<?php

declare(strict_types=1);

namespace App\Records\Docking;

use App\Docking\Cards\ComposedCard;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\DockDefinition;
use App\Records\Contracts\RecordResolver;
use App\Records\Data\RecordCard;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use App\Records\Docking\LegacyDockable;
use App\Records\Docking\DeclaredPageRoutes;

/**
 * Reads records with no card of their own through their record provider: one the actor may read for docking, and the
 * visible ones of a batch, each docked as its link card.
 */
final readonly class LegacyDockableProvider implements DockableProvider
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

    private function dockableOf(RecordCard $record): LegacyDockable
    {
        return new LegacyDockable($record, $this->pages->destinationOf($record->route)->getOrElse(null));
    }
}
