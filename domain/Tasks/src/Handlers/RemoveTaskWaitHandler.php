<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use Domain\Tasks\Commands\RemoveTaskWait;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Support\TaskGraphLock;

final readonly class RemoveTaskWaitHandler implements CommandHandler
{
    public function __construct(private TaskGraphLock $lock) {}

    /**
     * @throws TaskWaitRefused
     */
    public function handle(RemoveTaskWait $command): void
    {
        [$dependent] = $this->lock->lock($command->dependentTaskId, $command->prerequisiteTaskId);

        if ($dependent->state->hasEnded()) {
            throw TaskWaitRefused::dependentEnded($dependent->number, $dependent->state->value);
        }

        $wait = TaskWait::between($dependent->id, $command->prerequisiteTaskId);

        if ($wait === null) {
            throw TaskWaitRefused::noWait($dependent->number, Task::numberOf($command->prerequisiteTaskId));
        }

        TaskWaitHistory::record($wait, TaskWaitChange::Removed, ActorIdentity::of($command->dispatchedBy()), null);
        $wait->remove();
    }
}
