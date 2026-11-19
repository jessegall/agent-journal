<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use Domain\Tasks\Commands\EditTask;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskRevisionChanged;
use Domain\Tasks\Models\Task;

final readonly class EditTaskHandler implements CommandHandler
{
    /**
     * @throws TaskMissing
     * @throws TaskRevisionChanged
     */
    public function handle(EditTask $command): int
    {
        $task = Task::lockedById($command->taskId);

        if ($task->revision !== $command->expectedRevision) {
            throw TaskRevisionChanged::for($task->number, $command->expectedRevision, $task->revision);
        }

        $task->describe($command->title ?? $task->title, $command->brief ?? $task->brief);

        return $task->revision;
    }
}
