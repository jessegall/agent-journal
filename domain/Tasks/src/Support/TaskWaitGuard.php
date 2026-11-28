<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Access\Contracts\CurrentAuthorizer;
use App\Agents\Enums\AccessType;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * The rules every change of a wait follows, whether one wait changes or several at once.
 */
final readonly class TaskWaitGuard
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    /**
     * Whether the current actor may change the waits of this task: it may edit it and the task has not ended.
     */
    public function mayChange(Task $task): bool
    {
        $allowed = $this->authorizer->filterActions(TaskPolicy::class, $task, [AccessType::Edit]);

        return ! $task->status->hasEnded() && in_array(AccessType::Edit, $allowed, true);
    }

    /**
     * A wait may be added only between two tasks, to a dependent that has neither ended nor started, once.
     *
     * @throws TaskMissing
     * @throws TaskWaitRefused
     */
    public function assertMayAdd(Task $dependent, Task|null $prerequisite, string $prerequisiteId): Task
    {
        if ($prerequisite === null) {
            throw TaskMissing::forId($prerequisiteId);
        }

        if ($dependent->id === $prerequisite->id) {
            throw TaskWaitRefused::onItself($dependent->number);
        }

        if ($dependent->status->hasEnded()) {
            throw TaskWaitRefused::dependentEnded($dependent->number, $dependent->status->value);
        }

        if ($dependent->status === TaskStatus::Started) {
            throw TaskWaitRefused::dependentStarted($dependent->number);
        }

        if (TaskWait::findBetween($dependent->id, $prerequisite->id) !== null) {
            throw TaskWaitRefused::alreadyWaits($dependent->number, $prerequisite->number);
        }

        return $prerequisite;
    }

    /**
     * A wait may be removed only from a dependent that has not ended, and only when it exists.
     *
     * @throws TaskWaitRefused
     */
    public function existingToRemove(Task $dependent, string $prerequisiteId): TaskWait
    {
        if ($dependent->status->hasEnded()) {
            throw TaskWaitRefused::dependentEnded($dependent->number, $dependent->status->value);
        }

        $wait = TaskWait::findBetween($dependent->id, $prerequisiteId);

        if ($wait === null) {
            throw TaskWaitRefused::noWait($dependent->number, Task::resolveNumberOf($prerequisiteId));
        }

        return $wait;
    }
}
