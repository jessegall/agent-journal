<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Handlers\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class BlockTaskHandler extends TaskCommandHandler
{
    public function __construct(
        private Dispatcher $events,
    ) {}

    /**
     * @throws TaskRunNotYours
     */
    public function handle(BlockTask $command, Task $task): void
    {
        $this->assertCurrentTaskRun($task, $command->runNumber);
        $task->blockRun($command->reason);
        $this->events->dispatch(new TaskBlocked($command->taskId));
    }
}
