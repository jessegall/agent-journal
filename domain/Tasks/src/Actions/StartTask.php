<?php

declare(strict_types=1);

namespace Domain\Tasks\Actions;

use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\StackTransactionRunner;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Starts a task for an agent: the start and the push of its state commit together in one stack transaction.
 */
final readonly class StartTask
{
    public function __construct(
        private StackTransactionRunner $transaction,
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
