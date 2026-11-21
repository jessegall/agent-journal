<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Handlers\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;

final readonly class CancelTaskHandler extends TaskCommandHandler
{
    public function handle(CancelTask $command, Task $task): void
    {
        $task->cancel($command->reason);
    }
}
