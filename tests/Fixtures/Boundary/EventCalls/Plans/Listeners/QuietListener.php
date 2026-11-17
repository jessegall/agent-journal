<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Plans\Listeners;

use Tests\Fixtures\Boundary\EventCalls\Plans\Events\PlanStarted;
use Tests\Fixtures\Boundary\EventCalls\Tasks\Events\TaskClosed;

final class QuietListener
{
    public function handle(TaskClosed $event): void
    {
        event(new PlanStarted($event->taskId));
    }
}
