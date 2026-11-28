<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Windows;

use App\Reads\PageFormRequests;
use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Data\PlansPaneData;
use Domain\Plans\Http\Requests\PlansRequest;
use Domain\Plans\Models\Plan;
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
        $filters = $this->requests->from(PlansRequest::class, $visit)->filters();
        $policy = $this->policies->forType(PlansPaneData::class);
        $plans = $this->plans->preview($filters->toDomain(), $policy->limitFor('items'));

        $items = $plans->map(fn (Plan $plan) => LayoutRowData::build()
            ->key($plan->id)
            ->label($plan->title)
            ->value(ucfirst($plan->status->value))
            ->finish())->values()->all();

        return PlansPaneData::build()
            ->items($items)
            ->fullUrl(route('plans.list', $filters->toQuery(), false))
            ->finish();
    }
}
