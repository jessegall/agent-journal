<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Exceptions\TaskTextTooLong;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class CancelTaskHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
    ) {}

    /**
     * @throws TaskTextTooLong
     */
    public function handle(CancelTask $command, Task $task): void
    {
        $task->cancelWith($command->reason);
        $this->events->dispatch(new TaskCancelled($command->taskId));
    }
}
