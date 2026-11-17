<?php

declare(strict_types=1);

namespace App\Domain\Web\Views;

use App\Domain\Plans\PlanRecords;
use App\Domain\Web\Data\PaginationData;
use App\Domain\Web\Data\PlanCardData;
use App\Domain\Web\Data\PlanFiltersData;
use App\Domain\Web\Data\PlanListData;
use App\Domain\Web\Data\PlanReaderData;

/**
 * Shapes the plans the Plans domain reads into the page's slice; it neither queries tables nor restates the start rule.
 */
final readonly class PlansView
{
    public function __construct(private PlanRecords $records) {}

    public function plans(PlanFiltersData $filters): PlanListData
    {
        $list = $this->records->list($filters->toDomain());

        return PlanListData::from([
            'rows' => PlanCardData::collect($list->cards),
            'filters' => $filters->onPage($list->page),
            'pagination' => PaginationData::fromPlanList($list),
            'selectionMissing' => $list->selection->isMissing(),
            'selected' => PlanReaderData::ofSelection($list->selection),
        ]);
    }
}
