<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Contracts\TaskWaitResolver as TaskWaitResolverContract;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Values\TaskWaitLink;
use Domain\Tasks\Values\TaskWaits;

/**
 * Reads the waits between tasks with a fixed number of queries: the waits, then the other tasks of the page in one
 * batch; each wait is judged by TaskWait's one rule.
 */
final readonly class TaskWaitResolver implements TaskWaitResolverContract
{
    public const int MOST_WAITS_SHOWN = 100;

    public function __construct(
        private CurrentActor $actors,
        private TaskResolver $visibility,
    ) {}

    public function waitsOf(string $taskId): TaskWaits
    {
        $this->visibility->requireVisible($taskId);
        $waits = TaskWait::waitsOf($taskId, self::MOST_WAITS_SHOWN);
        $holds = TaskWait::holdersOf($taskId, self::MOST_WAITS_SHOWN);

        $others = Task::ofIds(array_values([
            ...array_map(strval(...), $waits->pluck('prerequisite_task_id')->all()),
            ...array_map(strval(...), $holds->pluck('dependent_task_id')->all()),
        ]));

        $self = Task::ofId($taskId);

        return new TaskWaits(
            array_values($waits->map(fn (TaskWait $wait) => self::linkOf(
                $wait,
                $others[$wait->prerequisite_task_id] ?? null,
                $wait->prerequisite_task_id,
                $others[$wait->prerequisite_task_id] ?? null,
            ))->all()),
            array_values($holds->map(fn (TaskWait $wait) => self::linkOf(
                $wait,
                $others[$wait->dependent_task_id] ?? null,
                $wait->dependent_task_id,
                $self,
            ))->all()),
        );
    }

    public function withWaitsAmong(array $ids): array
    {
        $this->actors->actor();

        return TaskWait::dependentIdsAmong($ids);
    }

    public function readyAmong(array $ids): array
    {
        $this->actors->actor();
        $waits = TaskWait::waitsOfTasks($ids);

        $prerequisites = Task::ofIds(
            array_values(array_map(strval(...), $waits->pluck('prerequisite_task_id')->all())),
        );

        $blocked = [];

        foreach ($waits as $wait) {
            if (! $wait->isSatisfiedBy(($prerequisites[$wait->prerequisite_task_id] ?? null)?->state)) {
                $blocked[$wait->dependent_task_id] = true;
            }
        }

        return array_values(array_filter($ids, fn (string $id) => ! isset($blocked[$id])));
    }

    /**
     * The link to the other task of the wait; the wait is judged by its prerequisite, whichever side is shown.
     */
    private static function linkOf(
        TaskWait $wait,
        Task|null $other,
        string $otherId,
        Task|null $prerequisite,
    ): TaskWaitLink {
        return new TaskWaitLink(
            $otherId,
            $other?->number,
            $other?->title,
            $other?->state,
            $wait->isSatisfiedBy($prerequisite?->state),
            $wait->waive_reason,
            $wait->waived_at === null ? null : CarbonImmutable::parse($wait->waived_at),
            $wait->waived_by_type === null || $wait->waived_by_id === null
                ? null
                : ActorIdentity::fromStored($wait->waived_by_type, $wait->waived_by_id),
        );
    }
}
