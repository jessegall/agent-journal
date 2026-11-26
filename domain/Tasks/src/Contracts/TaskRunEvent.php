<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a task run: every event of it implements this, so a listener typed on it receives them all.
 */
interface TaskRunEvent extends Event
{
    public string $taskId { get; }
}
