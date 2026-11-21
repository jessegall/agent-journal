<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Exceptions\PhaseRevisionChanged;
use Domain\Plans\Exceptions\TaskAlreadyInAPhase;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Contracts\TaskProgressCounter;

/**
 * Changes a plan's structure under the plan's lock: a new phase, and tasks placed in a phase once each, which moves
 * the phase's and the plan's task tallies by the placed tasks alone.
 */
final readonly class PlanStructure
{
    public function __construct(private TaskProgressCounter $taskCounts) {}

    public function addPhase(Plan $plan, string $title): Phase
    {
        Plan::lockStructure($plan->id);

        return Phase::create($plan, $title);
    }

    /**
     * Places the tasks at the end of the phase, in the given order, as a new revision of the phase, so a reader paging
     * the phase at the old one starts it over; a task already in a phase, or named twice, is refused before anything is
     * written. It runs inside the caller's transaction.
     *
     * @param  list<string>  $ids
     *
     * @throws TaskAlreadyInAPhase
     */
    public function addTasks(Phase $phase, array $ids): void
    {
        $plan = Plan::lockStructure($phase->plan_id);
        $phase->refresh();
        $duplicateTaskIds = array_keys(array_filter(array_count_values($ids), fn (int $count) => $count > 1));
        $alreadyPlacedTaskId = PhaseTask::query()->whereIn('task_id', $ids)->value('task_id');

        if ($duplicateTaskIds !== [] || $alreadyPlacedTaskId !== null) {
            throw TaskAlreadyInAPhase::forTask((string) ($duplicateTaskIds[0] ?? $alreadyPlacedTaskId));
        }

        $next = PhaseTask::query()->where('phase_id', $phase->id)->count() + 1;

        foreach ($ids as $offset => $taskId) {
            PhaseTask::create($phase, $taskId, $next + $offset);
        }

        $placed = PlanProgress::fromTaskProgress($this->taskCounts->progressOfPlaced($ids));
        $phase->recordProgress($phase->progress->plus($placed));
        $phase->advanceRevision();
        $plan->recordProgress($plan->progress->plus($placed));
    }

    /**
     * Adds the tasks only when the phase is still at the revision the caller read; adding makes its new revision.
     *
     * @param  list<string>  $ids
     *
     * @throws PhaseRevisionChanged
     * @throws TaskAlreadyInAPhase
     */
    public function addTasksAtRevision(Phase $phase, int $expectedRevision, array $ids): void
    {
        Plan::lockStructure($phase->plan_id);
        $phase->refresh();
        $phase->assertAtRevision($expectedRevision);
        $this->addTasks($phase, $ids);
    }
}
