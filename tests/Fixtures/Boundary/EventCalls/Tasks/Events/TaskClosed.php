<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Tasks\Events;

final readonly class TaskClosed
{
    public function __construct(public int $taskId) {}
}
