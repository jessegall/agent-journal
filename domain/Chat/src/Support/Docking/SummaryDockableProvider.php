<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Docking;

use App\Exceptions\RecordUnavailable;
use App\Records\Contracts\RecordSummaries;
use App\Records\Values\RecordSummary;
use App\Values\ProjectOwner;
use Domain\Chat\Contracts\Docking\CardContext;
use Domain\Chat\Contracts\Docking\Dockable;
use Domain\Chat\Contracts\Docking\DockableProvider;
use Domain\Chat\Exceptions\DockSourceUnavailable;
use Domain\Chat\Support\Cards\ComposedCard;
use Domain\Chat\Values\DockDefinition;

/**
 * Reads the records whose owner summarizes them through that owner's summary provider: one the actor may read for
 * docking, its project, and the visible ones of a batch, each docked as its summary.
 */
final readonly class SummaryDockableProvider implements DockableProvider
{
    public function __construct(private RecordSummaries $summaries) {}

    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        try {
            return new SummaryDockable($this->summaries->providerOf($definition->type)->requireReadable($id));
        } catch (RecordUnavailable $unavailable) {
            throw DockSourceUnavailable::unreadable($definition->type, $id, $unavailable);
        }
    }

    public function ownerOf(DockDefinition $definition, string $id): ProjectOwner
    {
        try {
            return $this->summaries->providerOf($definition->type)->ownerOf($id);
        } catch (RecordUnavailable $unavailable) {
            throw DockSourceUnavailable::unreadable($definition->type, $id, $unavailable);
        }
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        return array_map(
            function (RecordSummary $summary) use ($definition, $context) {
                $dockable = new SummaryDockable($summary);

                return new ComposedCard($dockable->identifyFor($definition), $dockable->composeDockCard($context));
            },
            $this->summaries->providerOf($definition->type)->visibleSummaries($ids),
        );
    }
}
