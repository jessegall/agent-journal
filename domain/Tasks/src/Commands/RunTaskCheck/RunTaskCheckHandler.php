<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\RunTaskCheck;

use App\Contracts\Processes\ProcessRunCallers;
use App\Exceptions\ProcessRunOfAnotherCaller;
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
    public function __construct(private ProcessRunCallers $callers) {}

    /**
     * The new check's id; a run that is not the task's current one, a process run another caller opened, and a process
     * run that already checks a task run are refused.
     *
     * @throws TaskRunOfAnotherActor
     * @throws TaskRunMissing
     * @throws ProcessRunOfAnotherCaller
     * @throws TaskCheckRefused
     */
    public function handle(RunTaskCheckCommand $command, Task $task): string
    {
        $this->assertCurrentTaskRun($task, $command->runNumber);
        $run = TaskRun::findNumberedOf($task, $command->runNumber);
        $caller = $command->dispatchedBy();

        $this->callers->callerOf($command->processRunId)
            ->filter(fn (ActorReference $opener) => $opener->isSameAs($caller))
            ->getOrThrow(ProcessRunOfAnotherCaller::forRun($command->processRunId));

        if (TaskCheck::findForProcessRun($command->processRunId) !== null) {
            throw TaskCheckRefused::alreadyRegistered($command->processRunId);
        }

        return TaskCheck::create($run, $command->operation, $caller, $command->processRunId)->id;
    }
}
