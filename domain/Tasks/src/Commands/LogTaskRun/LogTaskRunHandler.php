<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\LogTaskRun;

use App\Support\ActorReference;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Exceptions\TaskRunOfAnotherActor;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskLogEntry;
use Domain\Tasks\Models\TaskRun;

final readonly class LogTaskRunHandler extends TaskCommandHandler
{
    /**
     * The new entry's id; a run that is not the task's current one is refused.
     *
     * @throws TaskRunOfAnotherActor
     */
    public function handle(LogTaskRunCommand $command, Task $task): string
    {
        $this->assertCurrentTaskRun($task, $command->runNumber);
        $run = TaskRun::findForTask($task, $command->runNumber);

        if ($run === null) {
            throw TaskRunOfAnotherActor::forRun($task->number, $command->runNumber);
        }

        return TaskLogEntry::create($task, $run, ActorReference::of($command->dispatchedBy()), $command->text)->id;
    }
}
