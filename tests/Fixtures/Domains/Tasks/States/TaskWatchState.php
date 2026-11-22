<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Support\Decisions\ContextLine;
use App\Support\Inputs\StopRequested;
use App\Support\References\SubjectReference;
use App\Support\States\AgentState;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskFinished;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordCancelledTask\RecordCancelledTaskCommand;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordFinishedTask\RecordFinishedTaskCommand;

/**
 * A fixture watcher whose context identifies the frame reacting to a Tasks fact.
 */
class TaskWatchState extends AgentState
{
    public function __construct(private readonly SubjectReference $watch) {}

    public function onStop(StopRequested $input): ContextLine
    {
        return new ContextLine("Watch {$this->watch->runNumber} is active.");
    }

    public function onTaskFinished(TaskFinished $event): RecordFinishedTaskCommand|null
    {
        if ($event->taskId !== $this->watch->id) {
            return null;
        }

        return new RecordFinishedTaskCommand($event->taskId, $this->watch->runNumber);
    }

    public function onTaskCancelled(TaskCancelled $event): RecordCancelledTaskCommand|null
    {
        if ($event->taskId !== $this->watch->id) {
            return null;
        }

        return new RecordCancelledTaskCommand($event->taskId, $this->watch->runNumber);
    }
}
