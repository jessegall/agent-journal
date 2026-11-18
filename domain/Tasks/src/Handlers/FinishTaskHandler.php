<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Finishes the task under its row lock and tells listeners once the change has committed.
 */
final readonly class FinishTaskHandler
{
    public function __construct(
        private Dispatcher $events,
    ) {}

    public function handle(FinishTask $command): void
    {
        Task::lockedById($command->taskId)->finish();
        $this->events->dispatch(new TaskFinished($command->taskId));
    }
}
