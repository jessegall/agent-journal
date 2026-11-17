<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Listeners;

use App\Core\Hooks\Contracts\AgentStack;
use App\Domain\Tasks\Events\TaskStarted;
use App\Domain\Tasks\Readers\Support\TaskRecords;
use App\Domain\Tasks\States\Support\WorkingOnTaskStateReference;

/**
 * Puts the started run on the agent's stack in the same transaction as the start, so both commit or neither does.
 */
final readonly class PushTaskState
{
    public function __construct(
        private TaskRecords $tasks,
        private AgentStack $stacks,
    ) {}

    public function handle(TaskStarted $event): void
    {
        $this->stacks->push($event->target, WorkingOnTaskStateReference::forTask($this->tasks->get($event->taskId)));
    }
}
