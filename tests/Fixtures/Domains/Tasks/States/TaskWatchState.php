<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Attributes\StateType;
use App\Enums\SessionTransferType;
use App\Support\Decisions\ContextLine;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordCancelledTask\RecordCancelledTaskCommand;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordFinishedTask\RecordFinishedTaskCommand;
use Tests\Support\TestText;

/**
 * A fixture watcher whose context identifies the frame reacting to a Tasks fact.
 */
#[StateType('tasks.task_watch', schemaVersion: 1, transfer: SessionTransferType::Durable)]
class TaskWatchState extends AgentState
{
    public function __construct(private readonly string $taskId, private readonly int $runNumber) {}

    public function onStop(StopRequested $input): ContextLine
    {
        return new ContextLine(TestText::of("Watch {$this->runNumber} is active."));
    }

    public function onTaskFinished(TaskFinished $event): RecordFinishedTaskCommand|Decision
    {
        if ($event->taskId !== $this->taskId) {
            return Decision::delegate();
        }

        return new RecordFinishedTaskCommand($event->taskId, $this->runNumber);
    }

    public function onTaskCancelled(TaskCancelled $event): RecordCancelledTaskCommand|Decision
    {
        if ($event->taskId !== $this->taskId) {
            return Decision::delegate();
        }

        return new RecordCancelledTaskCommand($event->taskId, $this->runNumber);
    }
}
