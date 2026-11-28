<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Contracts\AssignmentQuery;
use App\Support\AssigneeIdentity;
use Domain\Tasks\Contracts\TaskListResolver as TaskListResolverContract;
use Domain\Tasks\Enums\TaskHolderFilter;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Resolvers\Support\TaskExecutions;
use Domain\Tasks\Support\TaskType;
use Domain\Tasks\Values\TaskFilters;
use Domain\Tasks\Values\TaskList;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/**
 * Lists the tasks every signed-in actor sees, ordered by id: the holder filter is a subquery of Core's assignments
 * inside the count and the page, then one query for the page's holders and one batch of agent labels for its runs.
 */
final readonly class TaskListResolver implements TaskListResolverContract
{
    public function __construct(
        private CurrentActor $actors,
        private AssigneeResolver $assignees,
        private TaskExecutions $executions,
        private AssignmentQuery $assignments,
    ) {}

    public function list(TaskFilters $filters): TaskList
    {
        $matching = $this->matching($filters);
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
    }

    /** @return Collection<int, Task> */
    public function preview(TaskFilters $filters, int $limit): Collection
    {
        return $this->matching($filters)->orderBy('id')->limit($limit)->get(['id', 'title', 'status']);
    }

    /** @return Builder<Task> */
    private function matching(TaskFilters $filters): Builder
    {
        $caller = AssigneeIdentity::of($this->actors->actor());

        return $this->heldAs(
            Task::query()->matching($filters->search)->inStates($filters->states)
                ->inEnvironments($filters->environmentIds),
            $filters->holder,
            $caller,
        );
    }

    /**
     * @param  Builder<Task>  $tasks
     * @return Builder<Task>
     */
    private function heldAs(Builder $tasks, TaskHolderFilter $holder, AssigneeIdentity $caller): Builder
    {
        return match ($holder) {
            TaskHolderFilter::Any => $tasks,
            TaskHolderFilter::Unassigned => $tasks->outsideSelectedIds(
                $this->assignments->assignedIds(TaskType::linkType()),
            ),
            TaskHolderFilter::Caller => $tasks->amongSelectedIds(
                $this->assignments->heldIds(TaskType::linkType(), $caller),
            ),
        };
    }
}
