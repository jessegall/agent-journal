<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\WaiveTaskWait;

use App\Support\ActorIdentity;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Support\TaskGraphLock;

final readonly class WaiveTaskWaitHandler extends TaskCommandHandler
{
    public function __construct(private TaskGraphLock $lock) {}

    /**
     * Waives an unresolved wait of a task that has not ended, with the actor and reason kept in its history.
     *
     * @throws TaskWaitRefused
     */
    public function handle(WaiveTaskWaitCommand $command): void
    {
        [$dependent] = $this->lock->lock($command->dependentTaskId, $command->prerequisiteTaskId);

        if ($dependent->state->hasEnded()) {
            throw TaskWaitRefused::dependentEnded($dependent->number, $dependent->state->value);
        }

        $wait = TaskWait::findBetween($dependent->id, $command->prerequisiteTaskId);

        if ($wait === null || $wait->isWaived()) {
            $prerequisite = Task::resolveNumberOf($command->prerequisiteTaskId);

            throw $wait === null
                ? TaskWaitRefused::noWait($dependent->number, $prerequisite)
                : TaskWaitRefused::alreadyWaived($dependent->number, $prerequisite);
        }

        $actor = ActorIdentity::of($command->dispatchedBy());
        $wait->waive($actor, $command->reason);
        TaskWaitHistory::create($wait, TaskWaitChange::Waived, $actor, $command->reason, null);
    }
}
