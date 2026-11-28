<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Windows;

use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlansPaneData;
use Domain\Plans\Http\Requests\PlansRequest;
use Illuminate\Http\Request;

final readonly class PlansWindowBuilder implements WindowBuilder
{
    public function __construct(
        private PlanResolver $plans,
        private PageFormRequests $requests,
        private SurfaceAttributeMap $policies,
    ) {}

    public function build(Request $visit): PlansPaneData
    {
        $filters = $this->requests->forVisit(PlansRequest::class, $visit)->filters();
        $policy = $this->policies->forType(PlansPaneData::class);
        $items = $this->plans->preview($filters->toDomain(), $policy->limitFor('items'));

        return PlansPaneData::build()
            ->items($items)
            ->fullUrl(route('plans.list', $filters->toQuery(), false))
            ->finish();
    }
}
