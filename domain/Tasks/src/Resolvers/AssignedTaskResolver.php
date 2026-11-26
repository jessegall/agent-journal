<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Contracts\AssignmentResolver;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Stacks\Contracts\Work\CurrentState;
use App\Stacks\References\StateReference;
use App\Support\AssigneeIdentity;
use Domain\Tasks\Contracts\AssignedTaskResolver as AssignedTaskResolverContract;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Resolvers\Support\TaskExecutions;
use Domain\Tasks\Support\States\Support\WorkOnTaskStateReference;
use Domain\Tasks\Values\TaskFilters;
use Domain\Tasks\Values\TaskList;
use PhpOption\Option;

/**
 * Lists the tasks the calling agent holds: the held ids come from Core, then one query of only those tasks filters,
 * orders by id, counts and pages them, all in one repeatable-read snapshot.
 */
final readonly class AssignedTaskResolver implements AssignedTaskResolverContract
{
    public function __construct(
        private CurrentActor $actors,
        private AssignmentTransaction $transaction,
        private AssignmentResolver $assignments,
        private AssigneeResolver $assignees,
        private CurrentState $states,
        private TaskExecutions $executions,
    ) {}

    public function currentForCaller(): Option
    {
        return $this->states->ofCaller(WorkOnTaskStateReference::class)
            ->flatMap(fn (StateReference $frame) => Task::resolveSummaryOf($frame));
    }

    public function assignedToCaller(TaskFilters $filters): TaskList
    {
        $holder = AssigneeIdentity::of($this->actors->actor());

        return $this->transaction->run(function () use ($filters, $holder): TaskList {
            $heldIds = $this->assignments->allRecordIdsFor(Task::linkType(), $holder);

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
                        fn (Task $task) => $task->card(
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
