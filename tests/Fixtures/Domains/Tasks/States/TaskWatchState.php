<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Hooks\Decisions\ContextLine;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\References\SubjectReference;
use App\Hooks\States\AgentState;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
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
