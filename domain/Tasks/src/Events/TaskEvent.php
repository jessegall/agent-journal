<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Contracts\Events\Event;

/**
 * A fact about tasks and their runs: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface TaskEvent extends Event
{
    public string $taskId { get; }
}
