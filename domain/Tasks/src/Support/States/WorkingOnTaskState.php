<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\States;

use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskWork;
use PhpOption\Option;
use PhpOption\Some;

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

    /**
     * @return Option<string>
     */
    public function workRecordType(): Option
    {
        return new Some(Task::LINK_TYPE);
    }

    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny($this->task->unfinishedReason());
    }

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return new Some("Work on task {$this->task->number}, run {$this->task->runNumber}.");
    }
}
