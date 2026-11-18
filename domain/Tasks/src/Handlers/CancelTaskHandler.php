<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Contracts\StackCleanup;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Cancels the task under its row lock and tells listeners once the change has committed.
 */
final readonly class CancelTaskHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private StackCleanup $cleanup,
    ) {}

    public function handle(CancelTask $command): void
    {
        $this->cleanup->endWork(Task::lockedById($command->taskId), fn (Task $task) => $task->cancel());
        $this->events->dispatch(new TaskCancelled($command->taskId));
    }
}
