<?php

declare(strict_types=1);

namespace Domain\Tasks\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Work\AgentStacks;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Resolvers\Support\TaskRecords;
use Domain\Tasks\Support\States\Support\WorkOnTaskStateReference;

/**
 * Puts the started run on the agent's stack in the same transaction as the start, so both commit or neither does.
 */
#[InCommandTransaction]
final readonly class PushTaskState implements Listener
{
    public function __construct(
        private TaskRecords $tasks,
        private AgentStacks $stacks,
    ) {}

    public function handle(TaskStarted $event): void
    {
        $this->stacks->activateForCaller(WorkOnTaskStateReference::forTask($this->tasks->get($event->taskId)));
    }
}
