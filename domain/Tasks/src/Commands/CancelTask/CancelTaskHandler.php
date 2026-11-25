<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\CancelTask;

use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Exceptions\TaskChangedSinceRead;
use Domain\Tasks\Models\Task;

final readonly class CancelTaskHandler extends TaskCommandHandler
{
    /**
     * Under the task's lock: only an open, started or blocked task cancels, and only at the revision and latest run the
     * caller read when it names them.
     *
     * @throws TaskChangedSinceRead
     */
    public function handle(CancelTaskCommand $command, Task $task): void
    {
        if ($task->status->hasEnded()) {
            throw TaskChangedSinceRead::notCancellable($task->number, $task->status);
        }

        $isRevisionMoved = $command->expectedRevision !== null && $command->expectedRevision !== $task->revision;
        $isRunMoved = $command->expectedRunNumber !== null && $command->expectedRunNumber !== $task->run_number;

        if ($isRevisionMoved || $isRunMoved) {
            throw TaskChangedSinceRead::now($task->number, $task->status, $task->run_number);
        }

        $task->cancel($command->reason);
    }
}
