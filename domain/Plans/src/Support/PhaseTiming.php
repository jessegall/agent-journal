<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentReader;
use App\Processes\Contracts\VerificationTiming;
use App\Processes\Values\TimingVerdict;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Contracts\TaskReader;
use Domain\Tasks\Enums\TaskState;

/**
 * Holds an agent's tests and checks while the current phase of a started plan it holds still has open or started
 * tasks (rule 31); an agent without a plan phase, and a user, may run them.
 */
final readonly class PhaseTiming implements VerificationTiming
{
    public function __construct(
        private CurrentActor $actors,
        private AssignmentReader $assignments,
        private TaskReader $tasks,
    ) {}

    public function forCaller(): TimingVerdict
    {
        $caller = $this->actors->actor();
        if ($caller->actorType() !== ActorType::Agent) {
            return TimingVerdict::allowed();
        }
        $heldIds = $this->assignments->allRecordIdsFor(Plan::LINK_TYPE, ActorIdentity::of($caller));
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
                fn (TaskSummary $task): bool => $task->state === TaskState::Open || $task->state === TaskState::Started,
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
