<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Values\AgentText;
use Domain\Tasks\Enums\TaskState;

/**
 * A fresh snapshot of one run of a task, read for one hook and never kept across hooks.
 */
final readonly class TaskWork
{
    public function __construct(
        public int $number,
        public int $runNumber,
        public TaskState $state,
        public bool $isCurrentRun = true,
        public bool $isHeld = true,
    ) {}

    /**
     * The same run, for a recipient that holds no valid claim on it.
     */
    public function unheld(): self
    {
        return clone ($this, ['isHeld' => false]);
    }

    /**
     * Whether this run is the task's current one, still started and held by its recipient; a finished, blocked,
     * cancelled or released run, an earlier run, or one another actor holds needs no more work here.
     */
    public function needsWork(): bool
    {
        return $this->isCurrentRun && $this->isHeld && $this->state === TaskState::Started;
    }

    public function unfinishedReason(): AgentText
    {
        return AgentText::of('tasks.unfinished', ['task' => $this->number]);
    }
}
