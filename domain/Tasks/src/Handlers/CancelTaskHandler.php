<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Cancels the task under its row lock and tells listeners once the change has committed.
 */
final readonly class CancelTaskHandler
{
    public function __construct(
        private Dispatcher $events,
    ) {}

    public function handle(CancelTask $command): void
    {
        Task::lockedById($command->taskId)->cancel();
        $this->events->dispatch(new TaskCancelled($command->taskId));
    }
}
