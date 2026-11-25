<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Contracts\Navigation\ClientUpdate;

/**
 * A line was added to a task run's log. Raised only once the change has committed; it names the entry so a reader
 * takes it once.
 */
final readonly class TaskLogged extends TaskEvent implements ClientUpdate
{
    public function __construct(
        public string $taskId,
        public string $entryId,
    ) {}
}
