<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\WorkStacks;
use App\Assignments\Contracts\AssignmentResolver;
use App\Assignments\Support\AssigneeIdentity;
use App\Processes\Contracts\VerificationTiming;
use App\Processes\Values\TimingVerdict;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Contracts\TaskResolver;

/**
 * Holds an agent's tests and checks while the current phase of a started plan it holds still has open or started
 * tasks (rule 31); an agent without a plan phase, and a user, may run them.
 */
final readonly class PhaseTiming implements VerificationTiming
{
    public function __construct(
        private CurrentActor $actors,
        private WorkStacks $workStacks,
        private AssignmentResolver $assignments,
        private TaskResolver $tasks,
    ) {}

    public function forCaller(): TimingVerdict
    {
        // An actor that works in no session, such as the owner, runs its checks whenever it asks.
        if ($this->workStacks->sessionsToAdmit() === []) {
            return TimingVerdict::allowed();
        }

        $caller = $this->actors->actor();
        $heldIds = $this->assignments->allRecordIdsFor(Plan::LINK_TYPE, AssigneeIdentity::of($caller));
        $started = Plan::query()->amongIds($heldIds)->inStates([PlanState::Started])->readLimit(500)->get();
        foreach ($started as $plan) {
            $verdict = $this->verdictOf($plan);
            if (! $verdict->isAllowed()) {
                return $verdict;
            }
        }

        return TimingVerdict::allowed();
    }

    /**
     * The plan's current phase is its first with a task that has not ended; its open and started tasks hold checks.
     */
    private function verdictOf(Plan $plan): TimingVerdict
    {
        foreach ($plan->phases()->readLimit(500)->get() as $phase) {
            $summaries = $this->tasks->summaries($phase->taskIds());
            if (array_all($summaries, fn (TaskSummary $task): bool => $task->state->hasEnded())) {
                continue;
            }
            $unfinished = array_filter(
                $summaries,
                fn (TaskSummary $task): bool => $task->state->isHoldingChecks(),
            );
            if ($unfinished === []) {
                return TimingVerdict::allowed();
            }
            $numbers = array_values(array_map(fn (TaskSummary $task): int => $task->number, $unfinished));

            return TimingVerdict::refused($plan->number, $phase->number, $numbers);
        }

        return TimingVerdict::allowed();
    }
}
