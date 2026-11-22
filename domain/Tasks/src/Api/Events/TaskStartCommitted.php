<?php

declare(strict_types=1);

namespace Domain\Tasks\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A task's start committed, so the pages that show the task read it again. It carries the task's id alone; the start
 * itself is TaskStarted, heard inside its transaction.
 */
final readonly class TaskStartCommitted implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(public string $taskId) {}
}
