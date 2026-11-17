<?php

declare(strict_types=1);

namespace App\Domain\Tasks\States;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\States\AgentState;
use App\Domain\Tasks\Support\TaskWork;

/**
 * The agent is working on a task: it may not stop while the task still needs work.
 */
final class WorkingOnTaskState extends AgentState
{
    public function __construct(private readonly TaskWork $task) {}

    public function isFinished(): bool
    {
        return ! $this->task->needsWork();
    }

    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->task->unfinishedReason());
    }
}
