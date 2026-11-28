<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\RemoveTaskWait;

use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Support\TaskGraphLock;
use Domain\Tasks\Support\TaskWaitGuard;

final readonly class RemoveTaskWaitHandler extends TaskCommandHandler
{
    public function __construct(private TaskGraphLock $lock, private TaskWaitGuard $rules) {}

    /**
     * @throws TaskWaitRefused
     */
    public function handle(RemoveTaskWaitCommand $command): void
    {
        [$dependent] = $this->lock->lock($command->dependentTaskId, $command->prerequisiteTaskId);
        $wait = $this->rules->existingToRemove($dependent, $command->prerequisiteTaskId);

        $actor = $command->dispatchedBy();
        TaskWaitHistory::create($wait, TaskWaitChange::Removed, $actor, null, null);
        $wait->remove();
    }
}
