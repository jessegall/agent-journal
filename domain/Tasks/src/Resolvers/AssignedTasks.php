<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Contracts\AssignmentResolver;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Support\AssigneeIdentity;
use App\Hooks\Contracts\ActorWorkStacks;
use App\Hooks\References\StateReference;
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskList;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Resolvers\Support\TaskExecutions;
use Domain\Tasks\States\Support\WorkingOnTaskStateReference;
use PhpOption\Option;

/**
 * Lists the tasks the calling agent holds: the held ids come from Core, then one query of only those tasks filters,
 * orders by id, counts and pages them, all in one repeatable-read snapshot.
 */
final readonly class AssignedTasks implements AssignedTaskResolver
{
    public function __construct(
        private CurrentActor $actors,
        private AssignmentTransaction $transaction,
        private AssignmentResolver $assignments,
        private AssigneeResolver $assignees,
        private ActorWorkStacks $workStack,
        private TaskExecutions $executions,
    ) {}

    public function currentForCaller(): Option
    {
        return $this->workStack->current(WorkingOnTaskStateReference::TYPE_KEY)
            ->flatMap(fn (StateReference $frame) => Task::summaryOf($frame));
    }

    public function assignedToCaller(TaskFilters $filters): TaskList
    {
        $holder = AssigneeIdentity::of($this->actors->actor());

        return $this->transaction->run(function () use ($filters, $holder): TaskList {
            $heldIds = $this->assignments->allRecordIdsFor(Task::LINK_TYPE, $holder);
            $matching = Task::query()->amongIds($heldIds)->matching($filters->search)->inStates($filters->states)
                ->inEnvironments($filters->environmentIds);
            $total = $matching->clone()->count();
            $tasks = $matching->orderBy('id')->forPage($filters->page->number, $filters->page->size)->get();

            $holders = $this->assignees->holdersOfRecords(
                array_values($tasks->map(fn (Task $task) => $task->assignmentIdentity())->all()),
            );

            $executions = $this->executions->of($tasks);

            return new TaskList(
                array_values(
                    $tasks->map(
                        fn (Task $task) => new TaskCard(
                            $task->id,
                            $task->title,
                            $task->state,
                            $holders->forRecord($task->assignmentIdentity()),
                            $executions[$task->id],
                        ),
                    )->all(),
                ),
                $filters->page,
                $total,
            );
        });
    }
}
