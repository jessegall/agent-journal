<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Handlers\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;

final readonly class BlockTaskHandler extends TaskCommandHandler
{
    /**
     * @throws TaskRunNotYours
     */
    public function handle(BlockTask $command, Task $task): void
    {
        $this->assertCurrentTaskRun($task, $command->runNumber);
        $task->block($command->reason);
    }
}
