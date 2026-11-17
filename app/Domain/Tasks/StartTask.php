<?php

declare(strict_types=1);

namespace App\Domain\Tasks;

use App\Core\Hooks\Contracts\StackWork;
use App\Core\Hooks\StackTarget;
use App\Domain\Tasks\Events\TaskStarted;
use App\Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Starts a task for an agent: the start and the push of its state commit together in one stack transaction.
 */
final readonly class StartTask
{
    public function __construct(
        private StackWork $transaction,
        private Dispatcher $events,
    ) {}

    public function start(Task $task, StackTarget $target): void
    {
        $this->transaction->run(function () use ($task, $target): void {
            $task->startFor($target);

            $this->events->dispatch(new TaskStarted($task->id, $target));
        });
    }
}
