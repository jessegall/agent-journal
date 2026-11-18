<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Contracts\StackCleanup;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Exceptions\TaskCancelRefused;
use Domain\Tasks\Exceptions\TaskTextTooLong;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskCaller;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CancelTaskHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private StackCleanup $cleanup,
        private TaskCaller $caller,
    ) {}

    /**
     * @throws TaskCancelRefused
     * @throws TaskTextTooLong
     */
    public function handle(CancelTask $command): void
    {
        $task = Task::lockedById($command->taskId);

        if (! $this->caller->mayCancel($task)) {
            throw TaskCancelRefused::forTask($task->number);
        }

        $this->cleanup->endWork($task, fn (Task $task) => $task->cancelWith($command->reason));
        $this->events->dispatch(new TaskCancelled($command->taskId));
    }
}
