<?php

declare(strict_types=1);

namespace Domain\Tasks\Readers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentReader;
use App\Assignments\Contracts\AssignmentTransaction;
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskList;
use Domain\Tasks\Contracts\AssignedTaskReader;
use Domain\Tasks\Models\Task;

/**
 * Lists the tasks the calling agent holds: the held ids come from Core, then one query of only those tasks filters,
 * orders by id, counts and pages them, all in one repeatable-read snapshot.
 */
final readonly class AssignedTasks implements AssignedTaskReader
{
    public function __construct(
        private CurrentActor $actors,
        private AssignmentTransaction $transaction,
        private AssignmentReader $assignments,
        private AssigneeReader $assignees,
    ) {}

    public function assignedToCaller(TaskFilters $filters): TaskList
    {
        $caller = $this->actors->actor();
        $caller->requireAgent();
        $holder = ActorIdentity::of($caller);

        return $this->transaction->run(function () use ($filters, $holder): TaskList {
            $heldIds = $this->assignments->allRecordIdsFor(Task::LINK_TYPE, $holder);
            $matching = Task::query()->amongIds($heldIds)->matching($filters->search)->inStates($filters->states);
            $total = $matching->clone()->count();
            $tasks = $matching->orderBy('id')->forPage($filters->page->number, $filters->page->size)->get();
            $holders = $this->assignees->holdersOf($this->assignments->assignmentsFor(array_values($tasks->map(fn (Task $task) => $task->assignmentIdentity())->all())));

            return new TaskList(
                array_values($tasks->map(fn (Task $task) => new TaskCard($task->id, $task->title, $task->state, $holders->forRecord($task->assignmentIdentity())->get()))->all()),
                $filters->page,
                $total,
            );
        });
    }
}
