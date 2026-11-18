<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Contracts\StackCleanup;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Exceptions\TaskTextTooLong;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskCaller;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class FinishTaskHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private StackCleanup $cleanup,
        private TaskCaller $caller,
    ) {}

    /**
     * @throws TaskRunNotYours
     * @throws TaskTextTooLong
     */
    public function handle(FinishTask $command): void
    {
        $task = Task::lockedById($command->taskId);
        $task->requireRun($command->runNumber, $this->caller->sessionId());
        $this->cleanup->endWork($task, fn (Task $task) => $task->finishRun($command->note));
        $this->events->dispatch(new TaskFinished($command->taskId));
    }
}
