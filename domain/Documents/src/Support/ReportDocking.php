<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Docking\Cards\ComposedCard;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
use App\Values\ProjectOwner;
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
            ->firstOr(DockSourceUnavailable::throwing()->of($definition->type, $id));
    }

    public function ownerOf(DockDefinition $definition, string $id): ProjectOwner
    {
        return Report::query()
            ->whereKey($id)
            ->firstOr(DockSourceUnavailable::throwing()->of($definition->type, $id))
            ->projectOwner();
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
