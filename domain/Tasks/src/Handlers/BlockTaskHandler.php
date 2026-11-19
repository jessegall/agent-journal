<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Exceptions\TaskTextTooLong;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class BlockTaskHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
    ) {}

    /**
     * @throws TaskRunNotYours
     * @throws TaskTextTooLong
     */
    public function handle(BlockTask $command, Task $task): void
    {
        $task->requireCurrentRun($command->runNumber);
        $task->blockRun($command->reason);
        $this->events->dispatch(new TaskBlocked($command->taskId));
    }
}
