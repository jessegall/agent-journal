<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Models\Task;

final readonly class CreateTaskHandler
{
    public function handle(CreateTask $command): string
    {
        return Task::query()->create(['title' => $command->title])->id;
    }
}
