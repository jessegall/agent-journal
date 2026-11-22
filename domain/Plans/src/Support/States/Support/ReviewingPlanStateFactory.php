<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States\Support;

use App\Enums\SessionTransferType;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\StateLoading\StateSet;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanWork;
use Domain\Plans\Support\States\ReviewingPlanState;

/**
 * Builds the reviewing-plan state from the plan as it is now, reading a batch of plans in one query.
 */
final readonly class ReviewingPlanStateFactory implements StateLoader
{
    public function stateClass(): string
    {
        return ReviewingPlanState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $ids = $references->subjectIds();
        $plans = Plan::query()->whereKey($ids)->readExactly(count($ids))->get()->keyBy('id')->all();

        return StateSet::forSubjects(
            $references,
            $plans,
            fn (Plan $plan) => new ReviewingPlanState(new PlanWork($plan->id, $plan->number, $plan->state)),
        );
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::Durable;
    }
}
