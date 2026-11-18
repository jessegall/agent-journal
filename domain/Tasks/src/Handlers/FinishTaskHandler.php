<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Contracts\StackCleanup;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Finishes the task under its row lock and tells listeners once the change has committed.
 */
final readonly class FinishTaskHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private StackCleanup $cleanup,
    ) {}

    public function handle(FinishTask $command): void
    {
        $this->cleanup->endWork(Task::lockedById($command->taskId), fn (Task $task) => $task->finish());
        $this->events->dispatch(new TaskFinished($command->taskId));
    }
}
