<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Ui\Contracts\PageResolver;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Data\PlanListData;
use Domain\Plans\Data\PlanPaginationData;
use Domain\Plans\Data\PlanReaderData;
use Domain\Plans\Http\Requests\PlansRequest;

/**
 * The plans window, on Home and on its own page: one page of plans by its search, with the selected plan's reader.
 */
final readonly class PlansWindowResolver implements PageResolver
{
    public function __construct(
        private PlansRequest $request,
        private PlanResolver $records,
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
