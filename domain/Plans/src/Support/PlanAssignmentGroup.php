<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Exceptions\AssignmentGroupTooLarge;
use App\Exceptions\RecordUnavailable;
use App\Support\AssignmentGroup;
use App\Support\RecordIdentity;
use App\Values\RecoveryCall;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseTask;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Contracts\TaskAssignmentResolver;
use Illuminate\Database\Eloquent\Collection;

/**
 * Collects the records a plan or phase cascade covers, under the plan's structure lock: a plan with its phases and
 * their tasks, or a phase with its tasks. It only reads the database, so it can run again when the transaction does;
 * a task id in a phase that no longer exists aborts the cascade.
 */
final readonly class PlanAssignmentGroup
{
    public function __construct(private TaskAssignmentResolver $tasks) {}

    public function for(RecordIdentity $root): AssignmentGroup
    {
        return match ($root->type) {
            Plan::linkType() => $this->forPlan($root),
            Phase::linkType() => $this->forPhase($root),
            default => throw RecordUnavailable::for($root),
        };
    }

    private function forPlan(RecordIdentity $root): AssignmentGroup
    {
        $plan = Plan::lockStructure($root->id);
        self::assertWithinLimit(1 + $plan->phases()->count() + $plan->total_tasks);

        $phases = Phase::query()->ofPlan($plan->id)->readAll('every phase of the plan is assigned')->orderBy('number')->get();

        return $this->group($root, $plan->id, [
            ...array_values($phases->map(fn (Phase $phase) => $phase->assignmentIdentity())->all()),
            ...$this->tasks->records($this->taskIdsOf($phases)),
        ]);
    }

    private function forPhase(RecordIdentity $root): AssignmentGroup
    {
        $phase = Phase::query()->findOr($root->id, RecordUnavailable::throwing()->for($root));
        Plan::lockStructure($phase->plan_id);
        self::assertWithinLimit(1 + $phase->total_tasks);

        return $this->group($root, $phase->plan_id, $this->tasks->records($this->taskIdsOf(new Collection([$phase]))));
    }

    /**
     * @param  list<RecordIdentity>  $records
     */
    private function group(RecordIdentity $root, string $planId, array $records): AssignmentGroup
    {
        return new AssignmentGroup($root, $records, new RecoveryCall('plans_read', ['plan_id' => $planId]));
    }

    /**
     * @param  Collection<int, Phase>  $phases
     * @return list<string>
     */
    private function taskIdsOf(Collection $phases): array
    {
        return array_map(
            strval(...),
            array_values(
                PhaseTask::query()->ofPhases($phases->modelKeys())->readAll('every task of the plan is assigned')
                    ->orderBy('phase_id')
                    ->orderBy('position')
                    ->pluck('task_id')
                    ->all(),
            ),
        );
    }

    /**
     * Refuses a unit larger than the one limit before any of its records is read: the count comes from the plan's and
     * phases' task tallies and one count of the plan's phases.
     *
     * @throws AssignmentGroupTooLarge
     */
    private static function assertWithinLimit(int $records): void
    {
        if ($records > AssignmentGroup::LARGEST) {
            throw AssignmentGroupTooLarge::for($records);
        }
    }
}
