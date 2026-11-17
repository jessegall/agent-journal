<?php

declare(strict_types=1);

namespace App\Domain\Plans\Support;

use App\Core\Assignments\Exceptions\RecordUnavailable;
use App\Core\Assignments\Support\AssignmentGroup;
use App\Core\Assignments\Support\RecordIdentity;
use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\PhaseTask;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\Contracts\TaskAssignmentReader;
use Illuminate\Database\Eloquent\Collection;

/**
 * Collects the records a plan or phase cascade covers, under the plan's structure lock: a plan with its phases and
 * their tasks, or a phase with its tasks. It only reads the database, so it can run again when the transaction does;
 * a task id in a phase that no longer exists aborts the cascade.
 */
final readonly class PlanAssignmentGroup
{
    public function __construct(private TaskAssignmentReader $tasks) {}

    public function for(RecordIdentity $root): AssignmentGroup
    {
        return match ($root->type) {
            Plan::LINK_TYPE => $this->forPlan($root),
            Phase::LINK_TYPE => $this->forPhase($root),
            default => throw RecordUnavailable::for($root),
        };
    }

    private function forPlan(RecordIdentity $root): AssignmentGroup
    {
        $plan = Plan::lockStructure($root->id);
        $phases = Phase::query()->where('plan_id', $plan->id)->orderBy('position')->get();

        return new AssignmentGroup($root, [
            ...array_values($phases->map(fn (Phase $phase) => $phase->assignmentIdentity())->all()),
            ...$this->tasks->records($this->taskIdsOf($phases)),
        ]);
    }

    private function forPhase(RecordIdentity $root): AssignmentGroup
    {
        $phase = Phase::query()->find($root->id) ?? throw RecordUnavailable::for($root);
        Plan::lockStructure($phase->plan_id);

        return new AssignmentGroup($root, $this->tasks->records($this->taskIdsOf(new Collection([$phase]))));
    }

    /**
     * @param  Collection<int, Phase>  $phases
     * @return list<int>
     */
    private function taskIdsOf(Collection $phases): array
    {
        return array_map(intval(...), array_values(PhaseTask::query()->whereIn('phase_id', $phases->modelKeys())->orderBy('phase_id')->orderBy('position')->pluck('task_id')->all()));
    }
}
