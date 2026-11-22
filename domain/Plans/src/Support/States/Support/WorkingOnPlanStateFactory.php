<?php

declare(strict_types=1);

namespace Domain\Plans\Support\States\Support;

use App\Enums\SessionTransferType;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\StateLoading\StateSet;
use App\Support\States\AgentState;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\PlanRecords;
use Domain\Plans\Support\PlanWork;
use Domain\Plans\Support\States\WorkingOnPlanState;
use Domain\Plans\Values\PlanProgress;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\Collection;

/**
 * Builds the working-on-plan state from the plan as it is now, reading a batch of plans in one query.
 */
final readonly class WorkingOnPlanStateFactory implements StateLoader
{
    /**
     * The container hands out the plan records when an instruction is rendered: the state types live for the whole
     * process, the records for one request, and a stack read needs no counts.
     */
    public function __construct(private Container $container) {}

    public function stateClass(): string
    {
        return WorkingOnPlanState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $ids = $references->subjectIds();
        $plans = Plan::query()->whereKey($ids)->readExactly(count($ids))->get()->keyBy('id')->all();

        return StateSet::forSubjects($references, $plans, function (Plan $plan): AgentState {
            $progress = fn (): PlanProgress => $this->container->make(PlanRecords::class)
                ->cardsOfPlans(new Collection([$plan]))[0]->progress;

            return new WorkingOnPlanState(new PlanWork($plan->id, $plan->number, $plan->state), $progress);
        });
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
