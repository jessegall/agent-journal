<?php

declare(strict_types=1);

namespace Domain\Plans\Readers;

use App\Actors\Contracts\CurrentActor;
use Domain\Plans\Api\PhaseDetails;
use Domain\Plans\Api\PlanDetails;
use Domain\Plans\Api\PlanPhaseTasks;
use Domain\Plans\Contracts\PlanDetailsReader;
use Domain\Plans\Enums\PlanView;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;

/**
 * Reads one plan with the progress PlanRecords computes for every plan list, and one phase with its task references;
 * progress counts tasks by their own state, never assignment rows.
 */
final readonly class PlanDetailRecords implements PlanDetailsReader
{
    public function __construct(
        private CurrentActor $actors,
        private PlanRecords $records,
    ) {}

    public function plan(string $planId, PlanView $view, int $taskOffset = 0): PlanDetails
    {
        $this->actors->actor();
        $plan = Plan::query()->find($planId) ?? throw PlanMissing::withId($planId);
        $card = $this->records->cardOf($plan);
        [$phases, $nextTaskOffset] = $this->phaseWindow($plan, $taskOffset);

        return $plan->details($card, $phases, $nextTaskOffset, $view->includesText());
    }

    public function phase(string $phaseId): PhaseDetails
    {
        $this->actors->actor();
        $phase = Phase::query()->find($phaseId) ?? throw PhaseMissing::withId($phaseId);

        return $phase->details();
    }

    /**
     * The plan's phases with the task references from the offset, at most 50 in all, and the offset after them while
     * more remain.
     *
     * @return array{0: list<PlanPhaseTasks>, 1: int|null}
     */
    private function phaseWindow(Plan $plan, int $taskOffset): array
    {
        $phases = [];
        $position = 0;
        $end = $taskOffset + self::TASKS_PER_READ;

        $planPhases = $plan->phases()->readAll('a plan read lists every phase')->get();
        $taskIdsByPhase = PhaseTask::taskIdsByPhase(array_values(array_map(strval(...), $planPhases->modelKeys())));

        foreach ($planPhases as $phase) {
            $taskIds = $taskIdsByPhase[$phase->id];
            $from = max($position, $taskOffset);
            $phases[] = $phase->withTasks(array_slice($taskIds, $from - $position, max(0, $end - $from)));
            $position += count($taskIds);
        }

        return [$phases, $position > $end ? $end : null];
    }
}
