<?php

declare(strict_types=1);

namespace Domain\Tasks\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Work\AgentStack;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Resolvers\Support\TaskRecords;
use Domain\Tasks\Support\States\Support\WorkingOnTaskStateReference;

/**
 * Puts the started run on the agent's stack in the same transaction as the start, so both commit or neither does.
 */
#[InCommandTransaction]
final readonly class PushTaskState implements Listener
{
    public function __construct(
        private TaskRecords $tasks,
        private AgentStack $stacks,
    ) {}

    public function handle(TaskStarted $event): void
    {
        $this->stacks->activateForCaller(WorkingOnTaskStateReference::forTask($this->tasks->get($event->taskId)));
    }
}
