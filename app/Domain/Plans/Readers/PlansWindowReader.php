<?php

declare(strict_types=1);

namespace App\Domain\Plans\Readers;

use App\Core\Ui\Contracts\PageReader;
use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Plans\Data\PlanCardData;
use App\Domain\Plans\Data\PlanListData;
use App\Domain\Plans\Data\PlanPaginationData;
use App\Domain\Plans\Data\PlanReaderData;
use App\Domain\Plans\Http\Requests\PlansRequest;

/**
 * The plans window, on Home and on its own page: one page of plans by its search, with the selected plan's reader.
 */
final readonly class PlansWindowReader implements PageReader
{
    public function __construct(
        private PlansRequest $request,
        private PlanReader $records,
    ) {}

    public function read(): PlanListData
    {
        $filters = $this->request->filters();
        $list = $this->records->list($filters->toDomain());

        return PlanListData::from([
            'rows' => PlanCardData::collect($list->cards),
            'filters' => $filters->onPage($list->page),
            'pagination' => PlanPaginationData::fromPlanList($list),
            'selectionMissing' => $list->selection->isMissing(),
            'selected' => PlanReaderData::ofSelection($list->selection),
        ]);
    }
}
