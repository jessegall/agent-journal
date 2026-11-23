<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\RunTaskCheck;

use App\Contracts\Processes\ProcessRunCallers;
use App\Support\ActorIdentity;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Exceptions\TaskCheckRefused;
use Domain\Tasks\Exceptions\TaskRunNotYours;
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
     * @throws TaskRunNotYours
     * @throws TaskCheckRefused
     */
    public function handle(RunTaskCheckCommand $command, Task $task): string
    {
        $this->assertCurrentTaskRun($task, $command->runNumber);
        $run = TaskRun::ofTask($task, $command->runNumber);

        if ($run === null) {
            throw TaskRunNotYours::forRun($task->number, $command->runNumber);
        }

        $caller = ActorIdentity::of($command->dispatchedBy());

        $isOpener = $this->callers->callerOf($command->processRunId)
            ->filter(fn (ActorIdentity $opener) => $opener->isSameAs($caller))
            ->isDefined();

        if (! $isOpener) {
            throw TaskCheckRefused::notYourRun($command->processRunId);
        }

        if (TaskCheck::ofProcessRun($command->processRunId) !== null) {
            throw TaskCheckRefused::alreadyRegistered($command->processRunId);
        }

        return TaskCheck::create($run, $command->operation, $caller, $command->processRunId)->id;
    }
}
