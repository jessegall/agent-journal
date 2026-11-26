<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\Support;

use App\Bus\Contracts\CommandHandler;
use Domain\Tasks\Exceptions\TaskRunOfAnotherActor;
use Domain\Tasks\Models\Task;

/**
 * The base of every Tasks handler, with the one check the run commands share.
 */
abstract readonly class TaskCommandHandler implements CommandHandler
{
    /**
     * Refuses work on a task under a run number that is not its current run.
     *
     * @throws TaskRunOfAnotherActor
     */
    final protected function assertCurrentTaskRun(Task $task, int $number): void
    {
        if (! $task->isCurrentRun($number)) {
            throw TaskRunOfAnotherActor::forRun($task->number, $number);
        }
    }
}
