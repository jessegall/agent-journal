<?php

declare(strict_types=1);

namespace App\Domain\Tasks;

use App\Domain\Tasks\Api\Events\TaskBlocked;
use App\Domain\Tasks\Api\Events\TaskCancelled;
use App\Domain\Tasks\Api\Events\TaskFinished;
use App\Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;

/**
 * Finishes, blocks or cancels a task, and tells everyone listening once the change has committed.
 */
final readonly class ChangeTaskState
{
    public function __construct(
        private ConnectionInterface $database,
        private Dispatcher $events,
    ) {}

    public function finish(Task $task): void
    {
        $this->database->transaction(function () use ($task): void {
            $task->finish();
            $this->events->dispatch(new TaskFinished($task->id));
        });
    }

    public function block(Task $task): void
    {
        $this->database->transaction(function () use ($task): void {
            $task->block();
            $this->events->dispatch(new TaskBlocked($task->id));
        });
    }

    public function cancel(Task $task): void
    {
        $this->database->transaction(function () use ($task): void {
            $task->cancel();
            $this->events->dispatch(new TaskCancelled($task->id));
        });
    }
}
