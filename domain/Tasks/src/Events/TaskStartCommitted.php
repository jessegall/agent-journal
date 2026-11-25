<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Contracts\Navigation\ClientUpdate;

/**
 * A task's start committed, so the pages that show the task read it again. It carries the task's id alone; the start
 * itself is TaskStarted, heard inside its transaction.
 */
final readonly class TaskStartCommitted extends TaskEvent implements ClientUpdate
{
    public function __construct(public string $taskId) {}
}
