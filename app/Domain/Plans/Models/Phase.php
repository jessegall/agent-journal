<?php

declare(strict_types=1);

namespace App\Domain\Plans\Models;

use App\Core\Links\Linkable;
use App\Domain\Plans\Exceptions\TaskAlreadyInAPhase;
use App\Domain\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Attributes\Fillable;
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
final class Phase extends Model
{
    use Linkable;

    /**
     * Puts a task at the end of this phase.
     */
    public function addTask(Task $task): void
    {
        if (PhaseTask::query()->where('task_id', $task->id)->exists()) {
            throw TaskAlreadyInAPhase::forTask($task->id);
        }

        PhaseTask::query()->create([
            'phase_id' => $this->id,
            'task_id' => $task->id,
            'position' => PhaseTask::query()->where('phase_id', $this->id)->count() + 1,
        ]);
    }

    /**
     * Puts several new tasks at the end of this phase, in the order given, with one insert.
     *
     * @param  list<Task>  $tasks
     */
    public function addTasks(array $tasks): void
    {
        $next = PhaseTask::query()->where('phase_id', $this->id)->count() + 1;

        PhaseTask::query()->insert(array_map(
            fn (Task $task, int $offset) => ['phase_id' => $this->id, 'task_id' => $task->id, 'position' => $next + $offset],
            $tasks,
            array_keys($tasks),
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
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['plan_id' => 'integer', 'position' => 'integer'];
    }
}
