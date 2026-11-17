<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Plans\Listeners;

use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Boundary\EventCalls\Tasks\Events\TaskClosed;

final class DispatchesByClass
{
    public function handle(TaskClosed $event): void
    {
        Event::dispatch(TaskClosed::class, [$event->taskId]);
    }
}
