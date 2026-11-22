<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use Domain\Tasks\Commands\WaiveTaskWait;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Support\TaskGraphLock;

final readonly class WaiveTaskWaitHandler implements CommandHandler
{
    public function __construct(private TaskGraphLock $lock) {}

    /**
     * Waives an unresolved wait of a task that has not ended, with the actor and reason kept in its history.
     *
     * @throws TaskWaitRefused
     */
    public function handle(WaiveTaskWait $command): void
    {
        [$dependent] = $this->lock->lock($command->dependentTaskId, $command->prerequisiteTaskId);

        if ($dependent->state->hasEnded()) {
            throw TaskWaitRefused::dependentEnded($dependent->number, $dependent->state->value);
        }

        $wait = TaskWait::between($dependent->id, $command->prerequisiteTaskId);

        if ($wait === null) {
            throw TaskWaitRefused::noWait($dependent->number, Task::numberOf($command->prerequisiteTaskId));
        }

        if ($wait->isWaived()) {
            throw TaskWaitRefused::alreadyWaived($dependent->number, Task::numberOf($command->prerequisiteTaskId));
        }

        $actor = ActorIdentity::of($command->dispatchedBy());
        $wait->waive($actor, $command->reason);
        TaskWaitHistory::record($wait, TaskWaitChange::Waived, $actor, $command->reason);
    }
}
