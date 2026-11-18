<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Processes\Contracts\VerificationTiming;
use App\Processes\Values\TimingVerdict;
use Domain\Plans\Api\AssignedPlanFilters;
use Domain\Plans\Contracts\PlanReader;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Phase;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Contracts\TaskReader;
use Domain\Tasks\Enums\TaskState;

/**
 * Holds an agent's tests and checks while the current phase of a started plan it holds still has open or started
 * tasks (rule 31); an agent without a plan phase, and a user, may run them.
 */
final readonly class PhaseTiming implements VerificationTiming
{
    public function __construct(private CurrentActor $actors, private PlanReader $plans, private TaskReader $tasks) {}

    public function forCaller(): TimingVerdict
    {
        if ($this->actors->actor()->actorType() !== ActorType::Agent) {
            return TimingVerdict::allowed();
        }
        $held = $this->plans->assignedToCaller(new AssignedPlanFilters(states: [PlanState::Started]));
        foreach ($held->cards as $card) {
            if ($card->currentPhase === null) {
                continue;
            }
            $phase = Phase::query()->where('plan_id', $card->id)->where('number', $card->currentPhase)->first();
            $unfinished = $phase === null ? [] : $this->unfinishedTasks($phase);
            if ($unfinished !== []) {
                return TimingVerdict::refused($card->number, $card->currentPhase, $unfinished);
            }
        }

        return TimingVerdict::allowed();
    }

    /**
     * @return list<int>
     */
    private function unfinishedTasks(Phase $phase): array
    {
        $open = array_filter(
            $this->tasks->summaries($phase->taskIds()),
            fn (TaskSummary $task): bool => $task->state === TaskState::Open || $task->state === TaskState::Started,
        );

        return array_values(array_map(fn (TaskSummary $task): int => $task->number, $open));
    }
}
