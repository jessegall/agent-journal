<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Docking\Cards\ComposedCard;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\DockDefinition;
use Domain\Documents\Models\Report;

/**
 * Reads published reports to dock: one by its id, and a batch in one query.
 */
final readonly class ReportDocking implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return Report::query()
            ->sharedPublished()
            ->whereKey($id)
            ->firstOr(fn () => throw DockSourceUnavailable::of($definition->type, $id));
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $reports = Report::query()
            ->sharedPublished()
            ->whereKey($ids)
            ->readExactly(count($ids))
            ->get();

        $cards = [];

        foreach ($reports as $report) {
            $cards[] = new ComposedCard($report->identifyFor($definition), $report->composeDockCard($context));
        }

        return $cards;
    }
}
