<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\CommandHandler;
use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Models\Task;

final readonly class CreateTaskHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors) {}

    public function handle(CreateTask $command): string
    {
        $creator = $this->actors->actor();

        return Task::file($command->title, $command->brief, $creator)->id;
    }
}
