<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Exceptions\TaskTextTooLong;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskLimits;

final readonly class CreateTaskHandler implements CommandHandler
{
    /**
     * @throws TaskTextTooLong
     */
    public function handle(CreateTask $command): string
    {
        TaskLimits::check($command->title, $command->brief);
        $creator = $command->dispatchedBy();

        return Task::file($command->title, $command->brief, $creator)->id;
    }
}
