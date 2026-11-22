<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Support\AssignmentHolder;
use App\Docking\Cards\ComposedCard;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\DockDefinition;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Illuminate\Database\Eloquent\Collection;

/**
 * Reads tasks to dock: one by its id, and a batch in one query with their holders read together.
 */
final readonly class TaskDocking implements DockableProvider
{
    public function __construct(private AssigneeResolver $assignees, private CurrentAuthorizer $authorizer) {}

    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        $task = Task::query()->whereKey($id)->firstOr(fn () => throw DockSourceUnavailable::of($definition->type, $id));

        return $this->docked($task->newCollection([$task]))[0];
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $cards = [];

        $readable = Task::query()
            ->whereKey($ids)
            ->readExactly(count($ids))
            ->get()
            ->filter(fn (Task $task) => $this->authorizer->filterActions(TaskPolicy::class, $task, [AccessType::Read]) !== []);

        foreach ($this->docked($readable) as $task) {
            $cards[] = new ComposedCard($task->identifyFor($definition), $task->composeDockCard($context));
        }

        return $cards;
    }

    /**
     * @param  Collection<int, Task>  $tasks
     * @return list<DockedTask>
     */
    private function docked(Collection $tasks): array
    {
        $holders = $this->assignees->holdersOfRecords(
            array_values($tasks->map(fn (Task $task) => $task->assignmentIdentity())->all()),
        );

        return array_values($tasks->map(fn (Task $task) => new DockedTask(
            $task,
            $holders->forRecord($task->assignmentIdentity())->map(fn (AssignmentHolder $holder) => $holder->name)
                ->getOrElse(null),
        ))->all());
    }
}
