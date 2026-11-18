<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Tasks\Events;

use App\Contracts\Event;

final readonly class TaskClosed implements Event
{
    public function __construct(public int $taskId) {}
}
