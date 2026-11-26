<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\DurableState;
use App\Stacks\Decisions\ContextLine;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskCancelled\RecordTaskCancelledCommand;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskFinished\RecordTaskFinishedCommand;
use Tests\Support\TestText;

/**
 * A fixture watcher whose context identifies the frame reacting to a Tasks fact.
 */
#[StateType(TaskWatchStateReference::class, schemaVersion: 1)]
class TaskWatchState extends AgentState implements DurableState
{
    public function __construct(private readonly string $taskId, private readonly int $runNumber) {}

    public function onStop(StopRequested $input): ContextLine
    {
        return new ContextLine(TestText::of("Watch {$this->runNumber} is active."));
    }

    public function onTaskFinished(TaskFinished $event): RecordTaskFinishedCommand|Decision
    {
        if ($event->taskId !== $this->taskId) {
            return Decision::delegate();
        }

        return new RecordTaskFinishedCommand($event->taskId, $this->runNumber);
    }

    public function onTaskCancelled(TaskCancelled $event): RecordTaskCancelledCommand|Decision
    {
        if ($event->taskId !== $this->taskId) {
            return Decision::delegate();
        }

        return new RecordTaskCancelledCommand($event->taskId, $this->runNumber);
    }
}
