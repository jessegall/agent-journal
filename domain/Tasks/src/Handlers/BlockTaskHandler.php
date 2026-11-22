<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskChangedSinceRead;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Handlers\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;

final readonly class BlockTaskHandler extends TaskCommandHandler
{
    /**
     * Under the task's lock: only the current run of a started task blocks; a blocked task is not blocked again and an
     * older run is refused, the newer run left as it is.
     *
     * @throws TaskRunNotYours
     * @throws TaskChangedSinceRead
     */
    public function handle(BlockTask $command, Task $task): void
    {
        if ($task->state !== TaskState::Started) {
            throw TaskChangedSinceRead::notBlockable($task->number, $task->state);
        }

        $this->assertCurrentTaskRun($task, $command->runNumber);
        $task->block($command->reason);
    }
}
