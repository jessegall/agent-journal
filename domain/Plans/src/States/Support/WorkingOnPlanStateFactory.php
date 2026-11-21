<?php

declare(strict_types=1);

namespace Domain\Plans\States\Support;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\References\StateReference;
use App\Hooks\References\SubjectReference;
use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\StateLoading\StateSet;
use App\Hooks\States\AgentState;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\PlanRecords;
use Domain\Plans\States\WorkingOnPlanState;
use Domain\Plans\Support\PlanWork;
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

        return StateSet::build($references, function (StateReference $reference) use ($plans): AgentState {
            $subject = $reference->subject;

            if (! $subject instanceof SubjectReference || ! isset($plans[$subject->id])) {
                throw StateSubjectMissing::for($reference->typeKey);
            }

            $plan = $plans[$subject->id];

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
