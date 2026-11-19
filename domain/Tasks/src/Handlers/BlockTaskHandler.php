<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Exceptions\TaskTextTooLong;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskCaller;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class BlockTaskHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private TaskCaller $caller,
    ) {}

    /**
     * @throws TaskRunNotYours
     * @throws TaskTextTooLong
     */
    public function handle(BlockTask $command): void
    {
        $task = Task::lockedById($command->taskId);
        $task->requireRun($command->runNumber, $this->caller->runOwner());
        $task->blockRun($command->reason);
        $this->events->dispatch(new TaskBlocked($command->taskId));
    }
}
