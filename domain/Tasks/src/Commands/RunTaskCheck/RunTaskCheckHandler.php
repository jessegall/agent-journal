<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\RunTaskCheck;

use App\Exceptions\ProcessRunOfAnotherActor;
use App\Processes\Contracts\ProcessRunResolver;
use App\Support\ActorReference;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Exceptions\TaskCheckRefused;
use Domain\Tasks\Exceptions\TaskRunMissing;
use Domain\Tasks\Exceptions\TaskRunOfAnotherActor;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskCheck;
use Domain\Tasks\Models\TaskRun;

final readonly class RunTaskCheckHandler extends TaskCommandHandler
{
    public function __construct(private ProcessRunResolver $processRuns) {}

    /**
     * The new check's id; a run that is not the task's current one, a process run another caller opened, and a process
     * run that already checks a task run are refused.
     *
     * @throws TaskRunOfAnotherActor
     * @throws TaskRunMissing
     * @throws ProcessRunOfAnotherActor
     * @throws TaskCheckRefused
     */
    public function handle(RunTaskCheckCommand $command, Task $task): string
    {
        $this->assertCurrentTaskRun($task, $command->runNumber);
        $run = TaskRun::findNumberedOf($task, $command->runNumber);
        $caller = $command->dispatchedBy();

        $this->processRuns->actorOf($command->processRunId)
            ->filter(fn (ActorReference $opener) => $opener->isSameAs($caller))
            ->getOrThrow(ProcessRunOfAnotherActor::forRun($command->processRunId));

        if (TaskCheck::findForProcessRun($command->processRunId) !== null) {
            throw TaskCheckRefused::alreadyRegistered($command->processRunId);
        }

        return TaskCheck::create($run, $command->operation, $caller, $command->processRunId)->getKey();
    }
}
