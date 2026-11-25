<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\AssignmentResolver;
use App\Contracts\Work\EnvironmentTasks;
use App\Support\AssigneeIdentity;
use App\Values\EnvironmentTask;
use App\Values\EnvironmentTaskList;
use Domain\Tasks\Models\Task;

/**
 * The tasks the acting user holds that were made through a binding of one environment, counted and the first by
 * number; a task of another environment, or made here, is never among them.
 */
final readonly class EnvironmentAssignedTasks implements EnvironmentTasks
{
    public function __construct(private CurrentActor $actors, private AssignmentResolver $assignments) {}

    public function assignedToActor(string $environmentId, int $most): EnvironmentTaskList
    {
        $held = $this->assignments->allRecordIdsFor(Task::linkType(), AssigneeIdentity::of($this->actors->actor()));
        $matching = Task::query()->amongIds($held)->inEnvironments([$environmentId]);
        $tasks = $matching->clone()->orderBy('number')->limit($most)->get();

        return new EnvironmentTaskList(
            $matching->count(),
            array_values($tasks->map(fn (Task $task) => new EnvironmentTask($task->number, $task->title))->all()),
        );
    }
}
