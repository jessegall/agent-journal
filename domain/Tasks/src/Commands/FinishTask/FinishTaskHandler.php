<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\FinishTask;

use App\Bus\Contracts\CommandFacts;
use App\Desks\Contracts\RunClaims;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Exceptions\TaskRunFinished;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Models\Task;

final readonly class FinishTaskHandler extends TaskCommandHandler
{
    public function __construct(
        private CommandFacts $facts,
        private RunClaims $claims,
    ) {}

    /**
     * Finishes the task, then its run and the run's claim; the task's fact follows the claim work's facts.
     *
     * @throws TaskRunNotYours
     * @throws TaskRunFinished
     */
    public function handle(FinishTaskCommand $command, Task $task): void
    {
        $this->assertCurrentTaskRun($task, $command->runNumber);

        $this->facts->holdUntilReturn(function () use ($command, $task): void {
            $task->finish($command->note);
            $run = $task->currentRun();

            if ($run !== null) {
                $run->finish($command->note);
                $this->claims->release($run->assignmentIdentity());
            }
        });
    }
}
