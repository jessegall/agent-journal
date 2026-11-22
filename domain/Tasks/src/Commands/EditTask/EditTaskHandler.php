<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\EditTask;

use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskRevisionChanged;
use Domain\Tasks\Models\Task;

final readonly class EditTaskHandler extends TaskCommandHandler
{
    /**
     * @throws TaskMissing
     * @throws TaskRevisionChanged
     */
    public function handle(EditTaskCommand $command): int
    {
        $task = Task::lockedById($command->taskId);

        if ($task->revision !== $command->expectedRevision) {
            throw TaskRevisionChanged::for($task->number, $command->expectedRevision, $task->revision);
        }

        $task->describe($command->title ?? $task->title, $command->brief ?? $task->brief);

        return $task->revision;
    }
}
