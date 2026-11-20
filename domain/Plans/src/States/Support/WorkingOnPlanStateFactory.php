<?php

declare(strict_types=1);

namespace Domain\Plans\States\Support;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;
use Domain\Plans\Models\Plan;
use Domain\Plans\States\WorkingOnPlanState;

/**
 * Builds the working-on-plan state from the plan as it is now, reading a batch of plans in one query.
 */
final readonly class WorkingOnPlanStateFactory implements StateLoader
{
    public function stateClass(): string
    {
        return WorkingOnPlanState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $ids = $references->subjectIds();
        $plans = Plan::query()->whereKey($ids)->readLimit(count($ids))->get()->keyBy('id')->all();

        return StateSet::build($references, function (StateReference $reference) use ($plans): AgentState {
            $subject = $reference->subject;

            if (! $subject instanceof SubjectReference || ! isset($plans[$subject->id])) {
                throw StateSubjectMissing::for($reference->typeKey);
            }

            return new WorkingOnPlanState($plans[$subject->id]->state);
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
