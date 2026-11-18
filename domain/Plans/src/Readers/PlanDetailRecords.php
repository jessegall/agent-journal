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
        $text = $view->includesText();

        return new PlanDetails(
            $plan->id,
            $plan->number,
            $plan->title,
            $plan->type,
            $plan->state,
            $plan->revision,
            $plan->creator_type,
            $plan->creator_id,
            $card->progress,
            $card->currentPhase,
            $phases,
            $nextTaskOffset,
            $text ? $plan->brief : null,
            $text ? $plan->finish_note : null,
            $text ? $plan->cancel_reason : null,
        );
    }

    public function phase(string $phaseId): PhaseDetails
    {
        $this->actors->actor();
        $phase = Phase::query()->find($phaseId) ?? throw PhaseMissing::withId($phaseId);

        return new PhaseDetails($phase->id, $phase->plan_id, $phase->number, $phase->title, $phase->revision, $phase->taskIds());
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

        foreach ($plan->phases()->readAll('a plan read lists every phase')->get() as $phase) {
            $taskIds = $phase->taskIds();
            $from = max($position, $taskOffset);
            $window = array_slice($taskIds, $from - $position, max(0, $end - $from));
            $phases[] = new PlanPhaseTasks($phase->id, $phase->number, $phase->title, $phase->revision, $window);
            $position += count($taskIds);
        }

        return [$phases, $position > $end ? $end : null];
    }
}
