<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Tasks\Actions;

use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed;

final class CloseTask
{
    public function close(int $taskId): void
    {
        TaskClosed::dispatch($taskId);
    }
}
