<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to what a task waits on.
 */
interface TaskWaitEvent extends Event
{
    public string $taskId { get; }
}
