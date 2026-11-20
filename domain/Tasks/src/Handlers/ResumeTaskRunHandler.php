<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Desks\Contracts\RunClaims;
use App\Desks\Exceptions\RunClaimRefused;
use Domain\Tasks\Commands\ResumeTaskRun;
use Domain\Tasks\Exceptions\TaskRunFinished;
use Domain\Tasks\Handlers\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;

final readonly class ResumeTaskRunHandler extends TaskCommandHandler
{
    public function __construct(
        private RunClaims $claims,
    ) {}

    /**
     * Claims the run for the actor through the task's current holder; the run keeps its number.
     *
     * @throws TaskRunFinished
     * @throws RunClaimRefused
     */
    public function handle(ResumeTaskRun $command, Task $task): int
    {
        $run = TaskRun::lockedById($command->runId);

        if ($run->isFinished()) {
            throw TaskRunFinished::forRun($run->id);
        }

        $this->claims->take(
            $run->assignmentIdentity(),
            $task->assignmentIdentity(),
            ActorIdentity::of($command->dispatchedBy()),
        );

        return $run->run_number;
    }
}
