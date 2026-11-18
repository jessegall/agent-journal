<?php

declare(strict_types=1);

namespace Domain\Tasks\Readers;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentReader;
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskList;
use Domain\Tasks\Contracts\TaskListReader;
use Domain\Tasks\Models\Task;

/**
 * Lists the tasks every signed-in actor sees, ordered by id: one query for the page, one for its holders and one batch
 * of agent labels for its runs.
 */
final readonly class ListedTasks implements TaskListReader
{
    public function __construct(
        private CurrentActor $actors,
        private AssignmentReader $assignments,
        private AssigneeReader $assignees,
        private TaskExecutions $executions,
    ) {}

    public function list(TaskFilters $filters): TaskList
    {
        $this->actors->actor();
        $matching = Task::query()->matching($filters->search)->inStates($filters->states);
        $total = $matching->clone()->count();
        $tasks = $matching->orderBy('id')->forPage($filters->page->number, $filters->page->size)->get();
        $holders = $this->assignees->holdersOf($this->assignments->assignmentsFor(array_values($tasks->map(fn (Task $task) => $task->assignmentIdentity())->all())));
        $executions = $this->executions->of($tasks);

        return new TaskList(
            array_values($tasks->map(fn (Task $task) => new TaskCard($task->id, $task->title, $task->state, $holders->forRecord($task->assignmentIdentity()), $executions[$task->id]))->all()),
            $filters->page,
            $total,
        );
    }
}
