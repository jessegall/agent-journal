<?php

declare(strict_types=1);

namespace App\Domain\Tasks\States;

use App\Domain\Hooks\Decisions\Decision;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Hooks\States\AgentState;
use App\Domain\Tasks\TaskWork;

/**
 * The agent is working on a task: it may not stop while the task still needs work.
 */
final class WorkingOnTask extends AgentState
{
    public function __construct(private readonly TaskWork $task) {}

    public function isFinished(): bool
    {
        return ! $this->task->needsWork();
    }

    public function onStop(StopRequested $input): Decision
    {
        if ($this->isFinished()) {
            return Decision::delegate();
        }

        return Decision::preventStop($this->task->unfinishedReason());
    }
}
