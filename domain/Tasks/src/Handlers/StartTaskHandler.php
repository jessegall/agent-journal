<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Agents\Contracts\SessionReader;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Resolves the session after every middleware, then starts the task for it under the task's row lock.
 */
final readonly class StartTaskHandler
{
    public function __construct(
        private SessionReader $sessions,
        private Dispatcher $events,
    ) {}

    public function handle(StartTask $command): void
    {
        $target = $this->sessions->requireActive($command->sessionId);

        Task::lockedById($command->taskId)->startFor($target);
        $this->events->dispatch(new TaskStarted($command->taskId, $target));
    }
}
