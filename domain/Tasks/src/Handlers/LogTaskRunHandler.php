<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Tasks\Commands\LogTaskRun;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Handlers\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskLogEntry;
use Domain\Tasks\Models\TaskRun;

final readonly class LogTaskRunHandler extends TaskCommandHandler
{
    /**
     * The new entry's id; a run that is not the task's current one is refused.
     *
     * @throws TaskRunNotYours
     */
    public function handle(LogTaskRun $command, Task $task): string
    {
        $this->assertCurrentTaskRun($task, $command->runNumber);
        $run = TaskRun::ofTask($task, $command->runNumber);

        if ($run === null) {
            throw TaskRunNotYours::forRun($task->number, $command->runNumber);
        }

        return TaskLogEntry::create($task, $run, ActorIdentity::of($command->dispatchedBy()), $command->text)->id;
    }
}
