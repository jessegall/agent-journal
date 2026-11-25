<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\RunTaskCheck;

use App\Contracts\Processes\ProcessRunCallers;
use App\Support\ActorReference;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Exceptions\TaskCheckRefused;
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
     * @throws TaskCheckRefused
     */
    public function handle(RunTaskCheckCommand $command, Task $task): string
    {
        $this->assertCurrentTaskRun($task, $command->runNumber);
        $run = TaskRun::findForTask($task, $command->runNumber);

        if ($run === null) {
            throw TaskRunOfAnotherActor::forRun($task->number, $command->runNumber);
        }

        $caller = ActorReference::of($command->dispatchedBy());

        $isOpener = $this->callers->callerOf($command->processRunId)
            ->filter(fn (ActorReference $opener) => $opener->isSameAs($caller))
            ->isDefined();

        if (! $isOpener) {
            throw TaskCheckRefused::notYourRun($command->processRunId);
        }

        if (TaskCheck::findForProcessRun($command->processRunId) !== null) {
            throw TaskCheckRefused::alreadyRegistered($command->processRunId);
        }

        return TaskCheck::create($run, $command->operation, $caller, $command->processRunId)->id;
    }
}
