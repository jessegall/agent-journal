<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\CommandRules\Enums\ReadView;
use Domain\Plans\Contracts\PlanDetailsResolver as PlanDetailsResolverContract;
use Domain\Plans\Exceptions\PhaseMissing;
use Domain\Plans\Exceptions\PlanMissing;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Plans\Values\PhaseDetails;
use Domain\Plans\Values\PlanDetails;
use Domain\Plans\Values\PlanPhaseTasks;

/**
 * Reads one plan with the progress PlanResolver computes for every plan list, and one phase with its task references;
 * progress counts tasks by their own state, never assignment rows.
 */
final readonly class PlanDetailsResolver implements PlanDetailsResolverContract
{
    public function __construct(
        private CurrentActor $actors,
        private PlanResolver $records,
    ) {}

    public function plan(string $planId, ReadView $view, int $taskOffset = 0): PlanDetails
    {
        $this->actors->actor();
        $plan = Plan::query()->findOr($planId, PlanMissing::throwing()->withId($planId));
        $card = $this->records->cardOf($plan);
        [$phases, $nextTaskOffset] = $this->phaseWindow($plan, $taskOffset);

        return $plan->details($card, $phases, $nextTaskOffset, $view->includesText());
    }

    public function phase(string $phaseId): PhaseDetails
    {
        $this->actors->actor();
        $phase = Phase::query()->findOr($phaseId, PhaseMissing::throwing()->withId($phaseId));

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

        $planPhases = $plan->phases()->get();

        $taskIdsByPhase = PhaseTask::resolveTaskIdsByPhase(
            array_values(array_map(strval(...), $planPhases->modelKeys())),
        );

        foreach ($planPhases as $phase) {
            $taskIds = $taskIdsByPhase[$phase->id];
            $sliceStart = max($position, $taskOffset);
            $phases[] = $phase->withTasks(array_slice($taskIds, $sliceStart - $position, max(0, $end - $sliceStart)));
            $position += count($taskIds);
        }

        return [
            $phases,
            $position > $end ? $end : null,
        ];
    }
}
