<?php

declare(strict_types=1);

namespace Domain\Tasks\States;

use App\Hooks\Attributes\StackWide;
use App\Hooks\Contracts\WorkRecordState;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskWork;

/**
 * The agent is working on a task: it may not stop while the task still needs work.
 */
final class WorkingOnTaskState extends AgentState implements WorkRecordState
{
    public function __construct(private readonly TaskWork $task) {}

    public function isFinished(): bool
    {
        return ! $this->task->needsWork();
    }

    public function workRecordType(): string
    {
        return Task::LINK_TYPE;
    }

    #[StackWide]
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->task->unfinishedReason());
    }
}
