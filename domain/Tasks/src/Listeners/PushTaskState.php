<?php

declare(strict_types=1);

namespace Domain\Tasks\Listeners;

use App\Contracts\Listener;
use App\Hooks\Contracts\ActorWorkStacks;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Resolvers\Support\TaskRecords;
use Domain\Tasks\States\Support\WorkingOnTaskStateReference;

/**
 * Puts the started run on the agent's stack in the same transaction as the start, so both commit or neither does.
 */
final readonly class PushTaskState implements Listener
{
    public function __construct(
        private TaskRecords $tasks,
        private ActorWorkStacks $workStack,
    ) {}

    public function handle(TaskStarted $event): void
    {
        $this->workStack->push(WorkingOnTaskStateReference::forTask($this->tasks->get($event->taskId)));
    }
}
