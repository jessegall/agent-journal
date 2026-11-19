<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Models\Task;

final readonly class CreateTaskHandler implements CommandHandler
{
    public function handle(CreateTask $command): string
    {
        $creator = $command->dispatchedBy();

        return Task::file($command->title, $command->brief, $creator)->id;
    }
}
