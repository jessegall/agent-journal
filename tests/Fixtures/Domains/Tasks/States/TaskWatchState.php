<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Hooks\Attributes\StackWide;
use App\Hooks\Decisions\Decision;
use App\Hooks\References\SubjectReference;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use App\Hooks\Values\EventCommands;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordCancelledTask;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordFinishedTask;

/**
 * A fixture watcher whose context identifies the frame reacting to a Tasks fact.
 */
class TaskWatchState extends AgentState
{
    public function __construct(private readonly SubjectReference $watch) {}

    public function onStop(StopRequested $input): Decision
    {
        return Decision::allow()->withContext("Watch {$this->watch->runNumber} is active.");
    }

    public function onTaskFinished(TaskFinished $event): EventCommands
    {
        if ($event->taskId !== $this->watch->id) {
            return EventCommands::none();
        }

        return EventCommands::of(new RecordFinishedTask($event->taskId, $this->watch->runNumber))
            ->withContext("Watch {$this->watch->runNumber} saw the task finish.");
    }

    #[StackWide]
    public function onTaskCancelled(TaskCancelled $event): EventCommands
    {
        if ($event->taskId !== $this->watch->id) {
            return EventCommands::none();
        }

        return EventCommands::of(new RecordCancelledTask($event->taskId, $this->watch->runNumber))
            ->withMessage("Watch {$this->watch->runNumber} saw the task cancelled.");
    }
}
