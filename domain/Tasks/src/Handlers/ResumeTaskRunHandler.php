<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Desks\Contracts\RunClaims;
use App\Desks\Exceptions\RunClaimRefused;
use Domain\Tasks\Commands\ResumeTaskRun;
use Domain\Tasks\Exceptions\TaskRunFinished;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;

final readonly class ResumeTaskRunHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
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
        $run->requireUnfinished();
        $this->claims->take($run->assignmentIdentity(), $task->assignmentIdentity(), ActorIdentity::of($this->actors->actor()));

        return $run->run_number;
    }
}
