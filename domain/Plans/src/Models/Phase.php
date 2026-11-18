<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Assignments\Contracts\Assignable;
use App\Assignments\Support\RecordIdentity;
use App\Links\Support\Linkable;
use Domain\Plans\Exceptions\TaskAlreadyInAPhase;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One phase of a plan, at its place in the plan, holding tasks in order. A task sits in one phase at most.
 *
 * @property int $id
 * @property int $plan_id
 * @property string $title
 * @property int $position
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'position'])]
final class Phase extends Model implements Assignable
{
    use Linkable;

    /**
     * The stable name links and assignments use for a phase.
     */
    public const string LINK_TYPE = 'plans.phase';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['plan_id' => 'integer', 'position' => 'integer'];
    }

    /**
     * Puts a task, named by id, at the end of this phase. The caller has checked with Tasks that the task exists.
     */
    public function addTask(int $taskId): void
    {
        $this->addTasks([$taskId]);
    }

    /**
     * Puts several tasks, named by id, at the end of this phase in the order given, with one insert. A task already in
     * a phase, or named twice, is refused before anything is written.
     *
     * @param  list<int>  $taskIds
     */
    public function addTasks(array $taskIds): void
    {
        $this->getConnection()->transaction(fn () => $this->addTasksUnderPlanLock($taskIds));
    }

    /**
     * @param  list<int>  $taskIds
     */
    private function addTasksUnderPlanLock(array $taskIds): void
    {
        Plan::lockStructure($this->plan_id);
        $twice = array_keys(array_filter(array_count_values($taskIds), fn (int $count) => $count > 1));
        $placed = PhaseTask::query()->whereIn('task_id', $taskIds)->value('task_id');

        if ($twice !== [] || $placed !== null) {
            throw TaskAlreadyInAPhase::forTask((int) ($twice[0] ?? $placed));
        }

        $next = PhaseTask::query()->where('phase_id', $this->id)->count() + 1;

        PhaseTask::query()->insert(array_map(
            fn (int $taskId, int $offset) => ['phase_id' => $this->id, 'task_id' => $taskId, 'position' => $next + $offset],
            $taskIds,
            array_keys($taskIds),
        ));
    }

    /**
     * @return list<int>
     */
    public function taskIds(): array
    {
        return array_map(intval(...), array_values(PhaseTask::query()->where('phase_id', $this->id)->orderBy('position')->pluck('task_id')->all()));
    }

    /**
     * @return BelongsTo<Plan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * The phase that holds the task, if any.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function holdingTask(Builder $query, int $taskId): void
    {
        $query->whereIn('id', PhaseTask::query()->select('phase_id')->where('task_id', $taskId));
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }
}
