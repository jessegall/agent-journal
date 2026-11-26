<?php

declare(strict_types=1);

namespace Domain\Tasks\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\Events\Listener;
use Domain\Tasks\Events\TaskStartCommitted;
use Domain\Tasks\Events\TaskStarted;

/**
 * Stages the page signal of a task's start for release after the commit, so the tasks list and the task's reader
 * read it again, in a plan or not; a start that rolls back sends nothing.
 */
#[InCommandTransaction]
final readonly class AnnounceTaskStart implements Listener
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(TaskStarted $event): void
    {
        $this->facts->publishAfterCommit(new TaskStartCommitted($event->taskId));
    }
}
