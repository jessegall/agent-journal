<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\UnfocusTask;

use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;

final readonly class UnfocusTaskHandler extends TaskCommandHandler
{
    public function handle(UnfocusTaskCommand $command): void
    {
        $task = Task::lockedById($command->taskId);

        if ($task->focused_by_id === $command->dispatchedBy()->id) {
            $task->unfocus();
        }
    }
}
