<?php

declare(strict_types=1);

namespace Domain\Plans\Support\Mcp;

use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\OverviewSection;
use App\Support\NumberedPage;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Values\AssignedPlanFilters;

/**
 * The plans section of the caller's overview: how many unfinished plans it holds, and the call that lists them.
 */
final readonly class HeldPlansOverview implements OverviewContribution
{
    public function __construct(private PlanResolver $plans) {}

    public function section(): string
    {
        return 'plans';
    }

    public function read(): OverviewSection
    {
        $states = array_values(array_filter(PlanState::cases(), fn (PlanState $state): bool => ! $state->hasEnded()));

        $held = $this->plans->assignedToCaller(
            new AssignedPlanFilters(states: $states, page: new NumberedPage(1, 1)),
        )->total;

        $stateNames = array_map(fn (PlanState $state): string => $state->value, $states);

        return OverviewSection::from([
            'title' => 'Plans you hold',
            'counts' => ['held' => $held],
            'nextAction' => new NextAction('plans_assigned', ['states' => $stateNames]),
        ]);
    }
}
