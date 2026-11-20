<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Handlers\Support\TaskCommandHandler;
use Domain\Tasks\Models\Task;

final readonly class CreateTaskHandler extends TaskCommandHandler
{
    public function handle(CreateTask $command): string
    {
        $creator = $command->dispatchedBy();

        return Task::create($command->title, $command->brief, $creator)->id;
    }
}
