<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\UnfocusTask;

use App\Contracts\Work\AgentFocuses;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;

final readonly class UnfocusTaskHandler extends TaskCommandHandler
{
    public function __construct(private AgentFocuses $focuses) {}

    public function handle(UnfocusTaskCommand $command): void
    {
        $this->focuses->unfocus($command->dispatchedBy(), Task::findLockedById($command->taskId));
    }
}
