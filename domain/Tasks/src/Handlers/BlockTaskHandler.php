<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Hooks\Contracts\StackCleanup;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Blocks the task under its row lock and tells listeners once the change has committed.
 */
final readonly class BlockTaskHandler
{
    public function __construct(
        private Dispatcher $events,
        private StackCleanup $cleanup,
    ) {}

    public function handle(BlockTask $command): void
    {
        $this->cleanup->endWork(Task::lockedById($command->taskId), fn (Task $task) => $task->block());
        $this->events->dispatch(new TaskBlocked($command->taskId));
    }
}
