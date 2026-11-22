<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Contracts\AssigneeResolver;
use App\Contracts\CurrentAuthorizer;
use App\Enums\AccessType;
use App\Exceptions\DockSourceUnavailable;
use App\Support\AssignmentHolder;
use App\Support\Cards\ComposedCard;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\DockDefinition;
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
