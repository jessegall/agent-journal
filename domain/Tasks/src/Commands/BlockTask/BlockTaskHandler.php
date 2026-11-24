<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\BlockTask;

use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskChangedSinceRead;
use Domain\Tasks\Exceptions\TaskRunOfAnotherActor;
use Domain\Tasks\Models\Task;

final readonly class BlockTaskHandler extends TaskCommandHandler
{
    /**
     * Under the task's lock: only the current run of a started task blocks; a blocked task is not blocked again and an
     * older run is refused, the newer run left as it is.
     *
     * @throws TaskRunOfAnotherActor
     * @throws TaskChangedSinceRead
     */
    public function handle(BlockTaskCommand $command, Task $task): void
    {
        if ($task->state !== TaskState::Started) {
            throw TaskChangedSinceRead::notBlockable($task->number, $task->state);
        }

        $this->assertCurrentTaskRun($task, $command->runNumber);
        $task->block($command->reason);
    }
}
