<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\CommandHandler;
use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Exceptions\TaskTextTooLong;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskLimits;

final readonly class CreateTaskHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @throws TaskTextTooLong
     */
    public function handle(CreateTask $command): string
    {
        TaskLimits::check($command->title, $command->brief);
        $creator = $this->actors->actor();

        return Task::query()->create([
            'title' => $command->title,
            'brief' => $command->brief,
            'creator_type' => $creator->type,
            'creator_id' => $creator->id,
        ])->id;
    }
}
