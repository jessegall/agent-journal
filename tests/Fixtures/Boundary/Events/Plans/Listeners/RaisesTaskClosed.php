<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans\Listeners;

use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed;

final class RaisesTaskClosed
{
    public function handle(TaskClosed $event): TaskClosed
    {
        return new TaskClosed($event->taskId);
    }
}
